import {stream2 as stream} from "air-stream";
import anime from "animejs/lib/anime.es.js";
import utils from "./utils";

const followers = new Map();

export default (view, frames, unit) => {
  return stream(null, (e, ctr) => {
    if (!view.map(({type}) => type).every(e => e === "active")) {
      throw "Error: expected all nodes to have type `active`";
    }

    const dom = view.map(e => e.node);
    let animation = null;
  
    ctr.todisconnect(() => {
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

    ctr.tocommand(({data: [data, {action = "default"}]} = {}) => {
      if (view.length === 0) {
        e({action: `${action}-complete`});
        return;
      }

      const allKeyframes = frames.filter(([name]) => name === action);

      if (!allKeyframes.length) {
        e({action: `${action}-complete`});
        return;
      }

      const classLists = [];
      const animParams = [];
      const animations = new Map();
      const properties = new Map();

      allKeyframes.forEach((keyframe) => {
        const keyframeProps = keyframe[1] ? keyframe[1](data) : {};
        const {easing, delay, duration, start} = keyframeProps;

        const offsets = keyframe.slice(2).map(([offset, func]) => {
          const {offset: elemOffset} = func(data);
          return elemOffset || offset;
        });

        const restoredOffsets = utils.restoreOffset(offsets);

        if (offsets && !utils.checkOffsetsValidity(restoredOffsets)) {
          throw "Error: animation error, keyframe offset wrong. Valid offset: >= 0, <= 1, ascending order.";
        }

        keyframe.slice(2).forEach(([offset, func], i) => {
          const {classList, offset: elemOffset, ...rest} = func(data);
          if (classList) {
            classLists.push({offset: restoredOffsets[i], classList: Object.entries(classList)});
          }
          if (Object.keys(rest).length) {
            Object.entries(rest).forEach(([key, value]) => {
              const animDuration = i === 0 ? restoredOffsets[0] * duration * 1000 : (restoredOffsets[i] - restoredOffsets[i - 1]) * duration * 1000;

              if (!duration) {
                if (!properties.has(key)) {
                  properties.set(key, []);
                  animParams.push(key);
                }
                const arr = properties.get(key);

                arr.push({
                  value
                });
              } else {
                if (!animations.has(key)) {
                  animations.set(key, []);
                  animParams.push(key);
                }
                const arr = animations.get(key);

                arr.push({
                  value,
                  duration: animDuration,
                  delay: i === 0 ? delay && delay * 1000 || 0 : 0,
                  easing,
                  start: start && start * 1000 || 0
                });
              }
            })
          }
        })
      });

      if ([...properties].length) {
        [...properties].map(([key, [{value}]]) => {
          anime.set(dom, {[key]: value});
        });
      }

      if (![...animations].length) {
        dom.forEach(elem => {
          classLists.forEach(({classList}) => {
            classList.forEach(([className, value]) => {
              elem.classList.toggle(className, value);
            })
          });
        });
        e({action: `${action}-complete`});
        return;
      }

      const props = allKeyframes.map((keyframe) => keyframe[1] ? keyframe[1](data) : {});

      const duration = Math.max(...props.map(({duration}) => duration || 0)) * 1000;

      animation = anime.timeline({
        targets: dom,
        autoplay: false,
        complete: () => {
          e({action: `${action}-complete`});
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
        easing: "easeOutCubic"
      });

      const test = [...animations].reduce((acc, [key, value]) => {
        const [{start}] = value;
        if (start !== 0) {
          return {
            ...acc,
            offs: [
              ...acc.offs,
              {
                [key]: value,
                start
              }
            ]
          }
        }
        return {
          ...acc,
          rest: {
            ...acc.rest,
            [key]: value
          }
        }
      }, {rest: {}, offs: []});

      animation.add({...test.rest}, 0);

      test.offs.forEach(({start, ...rest}) => {
        animation.add({...rest}, -start)
      });

      function matchesCount(a, b) {
        return a.filter(e => b.includes(e)).length;
      }

      dom.forEach(e => {
        !followers.has(e) && followers.set(e, []);

        followers.set(
            e,
            followers.get(e).filter(({anim, params}) => {
              if (matchesCount(params, animParams)) {
                anim.pause();
                return false;
              }
              return true;
            })
        );

        followers.get(e).push({anim: animation, params: animParams});
      });

      animation.play();
    });
  });
};
