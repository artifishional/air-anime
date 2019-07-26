import { stream } from "air-stream";
import anime from "animejs/lib/anime.es.js";
import utils from "./utils";

const followers = new Map();

export default (view, frames, layer) => {
  return stream((emt, { sweep, hook }) => {
    if (!view.map(({ type }) => type).every(e => e === "active")) {
      throw "Error: expected all nodes to have type `active`";
    }

    const dom = view.map(e => e.node);
    let animation = null;

    sweep.add(() => {
      dom.forEach(e => {
        const value = followers.get(e);
        if (value) {
          const index = value.findIndex(({ anim }) => anim === animation);
          animation.pause();
          value.splice(index, 1);
          if (!value.length) {
            followers.delete(e);
            anime.remove(e);
          }
        }
      });
    });

    hook.add(({ data: [data, { action = "default" }] } = {}) => {
      if (view.length === 0) {
        emt({ action: `${action}-complete` });
        return;
      }

      const allKeyframes = frames.filter(([name]) => name === action);

      // хочу так все переделать

      const test = allKeyframes.map((keyframe) => {
        const keyframeProps = keyframe[1] ? keyframe[1](data) : {};
        const {easing, delay, duration} = keyframeProps;
        if (!delay && !duration) {
          const props = keyframe.slice(2).map(([offset,func]) => {
            return {
              offset,
              ...func(data)
            }
          });
          return {
            type: 'static',
            props
          }
        }
        const props = keyframe.slice(2).reduce((acc1, [offset,func]) => {
          return Object.entries(func(data)).reduce((acc2, [key,value]) => {
            return {
              ...acc2,
              [key]: acc1[key] ? [
                ...acc1[key],
                value
              ] : [value]
            }
          }, {});
        }, {});
        return {
          type: 'animation',
          props,
          delay,
          duration,
          easing
        }
      });

      console.warn(dom, test);

      // хочу так все переделать

      if (!allKeyframes.length) {
        emt({ action: `${action}-complete` });
        return;
      }

      const animationInfo = allKeyframes.reduce((acc, keyframe) => {
        const info = keyframe[1] ? keyframe[1](data) : {};
        const duration = (info.duration || 0) * 1000;
        const delay = (info.delay || 0) * 1000;
        const easing = info.easing || "easeOutCubic";

        let keys = 0;

        const prop = keyframe.slice(2).reduce((acc, [offset,prop]) => {
          keys++
          return Object.entries(prop(data)).reduce((acc,[key]) => key, '');
        }, {});
        return {
          ...acc,
          [prop]: {
            duration,
            delay,
            easing,
            keys
          }
        }
      }, {});

      const testProps = allKeyframes.map((keyframe) => keyframe[1] ? keyframe[1](data) : {});

      const keys = allKeyframes.reduce((acc,keyframe) => {
        return [
          ...acc,
          ...keyframe.slice(2).map(([offset,prop]) => {
            return {
              offset,
              ...prop(data)
            }
          })
        ]
      }, []);

      if (!keys.every((key) => utils.checkOffsetValidity(key))) {
        throw "Error: animation error, keyframe offset wrong. Valid offset: >= 0, <= 1, ascending order.";
      }

      const keyframes = new Map();

      const duration = Math.max(...testProps.map(({duration}) => duration || 0)) * 1000;
      const start = 0;

      const animeObj = {
        targets: dom,
        easing: "easeOutCubic",
        complete: () => {
          emt({ action: `${action}-complete` });
          if (duration === 0) {
            dom.forEach(elem => {
              classWatchTest.forEach(({ classList }) => {
                classList.forEach(([className, value]) => {
                  elem.classList.toggle(className, value);
                });
              });
            });
          }
        },
        update: anim => {
          if (classWatchTest.length > 0) {
            dom.forEach(elem => {
              classWatchTest.forEach(({ classList }) => {
                classList.forEach(([className, value]) => {
                  elem.classList.toggle(className, value);
                });
              });
            });
          }
        },
        autoplay: false
      };

      // if (keys[0].offset === 0) {
      //   const { offset, classList, ...rest } = keys.splice(0, 1)[0];
      //   anime.set(dom, rest);
      // }
      //
      // utils.restoreOffset(keys);
      const classWatchTest = keys
          .filter(key => {
            return key.classList
          })
          .map(({ offset, classList }) => ({ offset, classList: Object.entries(classList) }));

      keys.forEach(key => {
        const { offset, classList, ...vars } = key;
        Object.entries(vars).forEach(([key, value]) => {
          if (!keyframes.has(key)) {
            keyframes.set(key, []);
          }
          const arr = keyframes.get(key);

          const info = animationInfo[key] || {delay: 0, duration: 0};

          arr.push({
            value,
            duration: offset === "0" ? 0 : (info.duration ? Math.round(info.duration / (info.keys - 1)) : 0),
            delay: offset === "0" ? info.delay : 0,
            easing: info.easing
          });
        });
      });

      const animParams = [];
      [...keyframes].forEach(([key, value]) => {
        animeObj[key] = value;
        animParams.push(key);
      });

      animation = anime(animeObj);

      function matchesCount(a, b) {
        return a.filter(e => b.includes(e)).length;
      }

      dom.forEach(e => {
        !followers.has(e) && followers.set(e, []);

        followers.set(
            e,
            followers.get(e).filter(({ anim, params }) => {
              if (matchesCount(params, animParams)) {
                anim.pause();
                return false;
              }
              return true;
            })
        );

        followers.get(e).push({ anim: animation, params: animParams });
      });

      if (start === 0) {
        animation.play();
      } else {
        if (start >= duration && duration !== 0) {
          animation.seek(duration);
        } else {
          animation.seek(start);
          animation.play();
        }
      }
    });
  });
};
