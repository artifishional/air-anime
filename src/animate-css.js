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


      const keyframes = frames.filter(([name]) => name === action);

      if (!keyframes) {
        emt({ action: `${action}-complete` });
        return;
      }

      const promises = keyframes.map((keyframe) => new Promise((resolve) => {

        const prop = keyframe[1] ? keyframe[1](data) : {};

        const keys = keyframe.slice(2).map(([offset, prop]) => ({
          offset,
          ...prop(data)
        }));

        if (!utils.checkOffsetValidity(keys)) {
          throw "Error: animation error, keyframe offset wrong. Valid offset: >= 0, <= 1, ascending order.";
        }

        const keyframes = new Map();

        const { easing = "easeOutCubic" } = prop;
        const duration = prop.duration * 1000 || 0;
        const start = prop.start * 1000 || 0;

        const animeObj = {
          targets: dom,
          easing,
          duration,
          complete: () => {
            resolve();
            if (duration === 0) {
              dom.forEach(elem => {
                classWatch.forEach(({ classList }) => {
                  classList.forEach(([className, value]) => {
                    elem.classList.toggle(className, value);
                  });
                });
              });
            }
          },
          update: anim => {
            if (classWatch.length > 0) {
              const { offset, classList } = classWatch[0];
              const { progress } = anim;
              if (progress / 100 >= offset) {
                dom.forEach(elem => {
                  classList.forEach(([className, value]) => {
                    elem.classList.toggle(className, value);
                  });
                });
                classWatch.shift();
              }
            }
          },
          autoplay: false
        };

        if (keys[0].offset === 0) {
          const { offset, classList, ...rest } = keys.splice(0, 1)[0];
          anime.set(dom, rest);
        }

        utils.restoreOffset(keys);
        const classWatch = keys
          .filter(key => key.classList)
          .map(({ offset, classList }) => ({ offset, classList: Object.entries(classList) }));

        keys.forEach(key => {
          const { offset, classList, ...vars } = key;
          Object.entries(vars).forEach(([key, value]) => {
            if (!keyframes.has(key)) {
              keyframes.set(key, []);
            }
            const arr = keyframes.get(key);
            arr.push({
              value,
              duration: offset
                ? offset * duration - arr.map(e => e.duration).reduce((p, c) => (p || 0) + (c || 0), 0)
                : undefined
            });
          });
        });

        const animParams = [];
        [...keyframes].forEach(([key, value]) => {
          animeObj[key] = value;
          animParams.push(key);
        });

        animation = anime(animeObj);

        function matchesCount (a, b) {
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
      }));

      Promise.all(promises).then(() => {
        emt({ action: `${action}-complete` });
      })
    });
  });
};
