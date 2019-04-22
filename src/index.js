import animateCss from "./animate-css";
import animateObj from "./animate-obj";

export default (view, ...other) => {
  if (view.length === 0) {
    return animateCss(view, ...other);
  }

  const { type } = view[0];

  if (type === "active") {
    return animateCss(view, ...other);
  } else if (type === "data") {
    return animateObj(view, ...other);
  } else {
    throw `Error: invalid animation type '${type}'`;
  }
};
