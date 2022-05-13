import animateCss from './animate-css.mjs';
import animateObj from './animate-obj.mjs';
import animateSound from './animate-sound.mjs';

export default (view, ...other) => {
  if (view.length === 0) {
    return animateCss(view, ...other);
  }

  const { type } = view[0];

  if (type === 'active') {
    return animateCss(view, ...other);
  } if (type === 'data') {
    return animateObj(view, ...other);
  } if (type === 'sound') {
    return animateSound(view.filter(({ type }) => type === 'sound'), ...other);
  }
  throw new Error(`Error: invalid animation type '${type}'`);
};
