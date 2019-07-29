import {stream} from "air-stream";
import anime from "animejs/lib/anime.es.js";
import utils from "./utils";

const followers = new Map();

export default (view, frames, layer) => {
  return stream((emt, {sweep, hook}) => {
    if (!view.map(({type}) => type).every(e => e === "active")) {
      throw "Error: expected all nodes to have type `active`";
    }

    const dom = view.map(e => e.node);
    let animation = null;

    sweep.add(() => {
      dom.forEach(e => {
        const value = followers.get(e);
        if (value) {
          const index = value.findIndex(({anim}) => anim === animation);
          animation.pause();
          value.splice(index, 1);
          if (!value.length) {
            followers.delete(e);
            anime.remove(e);
          }
        }
      });
    });

    hook.add(({data: [data, {action = "default"}]} = {}) => {
      if (view.length === 0) {
        emt({action: `${action}-complete`});
        return;
      }

      const allKeyframes = frames.filter(([name]) => name === action);

      console.warn(dom);

      const classLists = [];

      const keyframes = allKeyframes.map((keyframe) => {
        const keyframeProps = keyframe[1] ? keyframe[1](data) : {};
        const {easing, delay, duration} = keyframeProps;
        const props = keyframe.slice(2).reduce((acc1, [offset, func]) => {
          const rrr = Object.entries(func(data)).reduce((acc2, [key, value]) => {
            if (key === 'classList') {
              classLists.push({offset: offset || 0, classList: value && Object.entries(value)})
              return {
                ...acc2
              }
            }
            return {
              ...acc2,
              [key]: acc1[key] ? [
                ...acc1[key],
                {value, offset}
              ] : [{value, offset}]
            };
          }, {});
          return {
            ...acc1,
            ...rrr
          }
        }, {});
        return {
          type: 'animation',
          props,
          delay,
          duration,
          easing
        }
      });

      const animations = keyframes
          .filter(({type}) => type === 'animation')
          .reduce((acc, animation) => {
            const {props, delay, duration, easing} = animation;
            const result = Object.entries(props).reduce((a, [key, value]) => {
              const durationsArr = value.map(({offset}) => offset && duration && offset * duration || 0);
              return {
                ...a,
                [key]: value.map((v, i) => {
                  return {
                    value: v.value,
                    duration: i === 0 ? 0 : (durationsArr[i] - durationsArr[i - 1]) * 1000,
                    delay: i === 0 ? delay && delay * 1000 || 0 : 0,
                    easing
                  }
                })
              }
            }, {});
            return {
              ...acc,
              ...result
            }
          }, {});

      if (!allKeyframes.length) {
        emt({action: `${action}-complete`});
        return;
      }

      const props = allKeyframes.map((keyframe) => keyframe[1] ? keyframe[1](data) : {});

      const keys = allKeyframes.reduce((acc, keyframe) => {
        return [
          ...acc,
          ...keyframe.slice(2).map(([offset, prop]) => {
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

      const duration = Math.max(...props.map(({duration}) => duration || 0)) * 1000;
      const start = 0;

      const animeObj = {
        targets: dom,
        ...animations,
        easing: "easeOutCubic",
        complete: () => {
          emt({action: `${action}-complete`});
          if (duration === 0) {
            dom.forEach(elem => {
              classLists.forEach(({classList}) => {
                classList.forEach(([className, value]) => {
                  elem.classList.toggle(className, value);
                })
              });
            })
          }
        },
        update: anim => {
          const {progress} = anim;
          dom.forEach(elem => {
            classLists.forEach(({offset, classList}) => {
              if (progress / 100 >= offset) {
                classList.forEach(([className, value]) => {
                  elem.classList.toggle(className, value);
                })
              }
            });
          });
        },
        autoplay: false
      };

      animation = anime(animeObj);

      function matchesCount(a, b) {
        return a.filter(e => b.includes(e)).length;
      }

      // dom.forEach(e => {
      //   !followers.has(e) && followers.set(e, []);
      //
      //   followers.set(
      //       e,
      //       followers.get(e).filter(({ anim, params }) => {
      //         if (matchesCount(params, animParams)) {
      //           anim.pause();
      //           return false;
      //         }
      //         return true;
      //       })
      //   );
      //
      //   followers.get(e).push({ anim: animation, params: animParams });
      // });

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
