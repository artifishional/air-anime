export default {
  restoreOffset: function(kf) {
    const off = kf.map(({ offset }) => offset);
    const groups = [];
    const set = [];

    let prev = 0;
    off.forEach(e => {
      set.push(e);
      if (e !== undefined) {
        groups.push({
          prev,
          dur: e - prev,
          len: set.length,
          values: [...set]
        });
        set.length = 0;
        prev = e;
      }
    });
    const len = set.length;
    if (len > 0) {
      if (set[len - 1] === undefined) {
        set[len - 1] = 1;
      }
      groups.push({
        prev,
        dur: set[len - 1] - prev,
        len,
        values: [...set]
      });
    }

    groups.forEach(group => {
      const { prev, dur, len, values } = group;
      for (let i = 0; i < len - 1; i++) {
        values[i] = +(prev + (dur / len) * (i + 1)).toFixed(3);
      }
    });

    const offsets = groups.map(({ values }) => values).reduce((acc, val) => acc.concat(val), []);

    kf.forEach((e, i) => {
      e.offset = offsets[i];
    });
  },
  //
  checkOffsetValidity: function(kf) {
    let last = -1;
    for (let i = 0; i < kf.length; i++) {
      let { offset } = kf[i];
      if (offset === undefined && last === 1) {
        offset = 0;
      }
      if (offset < 0 || offset > 1 || offset <= last) {
        return false;
      }
      last = offset;
    }
    return true;
  }
};
