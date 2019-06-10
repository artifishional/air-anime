import animateCss from "./animate-css";
import animateObj from "./animate-obj";
import animateSound from "./animate-sound";

export default (view, ...other) => {
  if (view.length === 0) {
    return animateCss(view, ...other);
  }

  const { type } = view[0];

  if (type === "active") {
    return animateCss(view, ...other);
  } else if (type === "data") {
    return animateObj(view, ...other);
  } else if (type === "sound") {
    return animateSound(view.filter(({type}) => type === 'sound'), ...other);
  } else {
    throw `Error: invalid animation type '${type}'`;
  }
};
