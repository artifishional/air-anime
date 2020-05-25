import {stream} from "air-stream";
import anime from "animejs/lib/anime.es.js";
import { default as utils, fillKeyFrames } from "./utils";

const followers = new Map();

function matchesCount(a, b) {
  return a.filter(e => b.includes(e)).length;
}

export default (view, frames, unit) => {
  return stream((emt, {sweep, hook}) => {
    if (!view.map(({type}) => type).every(e => e === "active")) {
      throw "Error: expected all nodes to have type `active`";
    }

    function complete (action) {
      if(["fade-in", "fade-out"].includes(action)) {
        emt({action: `${action}-complete`});
      }
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
        return complete(action);
      }

      const allKeyframes = frames.filter(([name]) => name === action);

      if (!allKeyframes.length) {
        return complete(action);
      }

      const kf = fillKeyFrames(allKeyframes, data);

      if(!kf) {
        return complete(action);
      }


      const classLists = [];
      const animParams = [];
      const animations = new Map();
      const properties = new Map();

      kf.forEach((keyframe) => {

        const {easing, delay, duration, start} = keyframe[1];

        const offsets = keyframe.slice(2).map(([offset, data]) => {
          const {offset: elemOffset} = data;
          return elemOffset || offset;
        });

        const restoredOffsets = utils.restoreOffset(offsets);

        if (offsets && !utils.checkOffsetsValidity(restoredOffsets)) {
          throw "Error: animation error, keyframe offset wrong. Valid offset: >= 0, <= 1, ascending order.";
        }

        keyframe.slice(2).forEach(([offset, data], i) => {
          const {classList, offset: elemOffset, ...rest} = data;
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

      /**
       * Pause the competitive animation in this place,
       * because next comes the premature exit block
       */
      dom.forEach(e => {
        !followers.has(e) && followers.set(e, []);
        followers.set(
          e,
          followers.get(e).filter(({anim, params}) => {
            if (matchesCount(params, animParams)) {
              anim && anim.pause();
              return false;
            }
            return true;
          })
        );
      });

      if (![...animations].length) {
        dom.forEach(elem => {
          classLists.forEach(({classList}) => {
            classList.forEach(([className, value]) => {
              elem.classList.toggle(className, value);
            })
          });
        });
        return complete(action);
      }

      const props = kf.map((keyframe) => keyframe[1]);

      const duration = Math.max(...props.map(({duration}) => duration || 0)) * 1000;

      animation = anime.timeline({
        targets: dom,
        autoplay: false,
        complete: () => {
          dom.forEach(elem => {
            classLists.forEach(({classList}) => {
              classList.forEach(([className, value]) => {
                elem.classList.toggle(className, value);
              })
            });
          });
          return complete(action);
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

      dom.forEach(e => {
        !followers.has(e) && followers.set(e, []);
        followers.get(e).push({anim: animation, params: animParams});
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

      animation.play();
    });
  });
};
