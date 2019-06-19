import animateCss from "./animate-css";
import animateObj from "./animate-obj";
import animateSound from "./animate-sound";
import { combine } from 'air-stream';

export default (view, ...other) => {
  if (view.length === 0) {
    return animateCss(view, ...other);
  }

  const animates = [];
  const types = ['active', 'data', 'sound'];

  types.forEach(animateType => {
    const views = view.filter(({type}) => type === animateType);
    if (views.length) {
      switch (animateType) {
        case 'active':
          animates.push(animateCss(views, ...other));
          break;
        case 'data':
          animates.push(animateObj(views, ...other));
          break;
        case 'sound':
          animates.push(animateSound(views, ...other));
          break;
      }

    }
  });

  if (!animates.length) {
    throw `Error: invalid animation types`;
  } else {
    return combine(animates);
  }

};
