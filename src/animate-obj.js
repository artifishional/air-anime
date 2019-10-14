import {stream2 as stream} from "air-stream";
import anime from "animejs/lib/anime.es.js";
import utils from "./utils";

export default (view, frames, layer) => {
  return stream(null, (e, ctr) => {
    if (!view.map(({ type }) => type).every(e => e === "data")) {
      throw "Error: expected all nodes to have type `data`";
    }

    let animation = null;

    const state = {};
    function updateAll(data) {
      view.map(v => v.update(data));
    }

    function animationClear() {
      if (animation) {
        animation.pause();
        animation = null;
      }
    }

    ctr.todisconnect(() => animationClear);

    ctr.tocommand(({ data: [data, { action = "default" }] } = {}) => {
      animationClear();

      const keyframe = frames.find(([name]) => name === action);

      if (!keyframe) {
        updateAll(data);
        e({ action: `${action}-complete` });
        return;
      }

      const prop = keyframe[1](data);

      const keys = keyframe.slice(2).map(([offset, prop]) => ({
        offset,
        ...prop(data)
      }));

      if (!utils.checkOffsetValidity(keys)) {
        throw "Error: animation error, keyframe offset wrong. Valid offset: >= 0, <= 1, ascending order.";
      }

      const keyframes = new Map();

      const { easing = "easeOutElastic(1, .5)" } = prop;
      const duration = prop.duration * 1000 || 0;
      const start = prop.start * 1000 || 0;

      if (keys[0].offset === 0) {
        const { offset, ...vars } = keys[0];
        Object.entries(vars).forEach(([key]) => {
          if (!state.hasOwnProperty(key)) {
            state[key] = 0;
          }
          if (offset === 0) {
            state[key] = vars[key];
            updateAll(vars);
          }
        });
        keys.splice(0, 1)[0];
      }

      utils.restoreOffset(keys);

      keys.forEach(key => {
        const { offset, ...vars } = key;
        Object.entries(vars).forEach(([key, value]) => {
          if (!state.hasOwnProperty(key)) {
            state[key] = 0;
          }
          if (!keyframes.has(key)) {
            keyframes.set(key, []);
          }
          const arr = keyframes.get(key);
          if (offset !== 0) {
            arr.push({
              value,
              duration: offset
                ? offset * duration - arr.map(e => e.duration).reduce((p, c) => (p || 0) + (c || 0), 0)
                : undefined
            });
          }
        });
      });

      const animeObj = {
        targets: state,
        easing,
        duration,
        update: () => {
          updateAll(state);
        },
        complete: () => {
          if (duration === 0) {
            updateAll(state);
          }
          e({ action: `${action}-complete` });
        },
        autoplay: false
      };

      [...keyframes].forEach(([key, value]) => {
        animeObj[key] = value;
      });

      animation = anime(animeObj);
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
