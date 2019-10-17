export default {
  restoreOffset: function(off) {
    const groups = [];
    const set = [];

    let prev = 0;
    off.forEach(e => {
      set.push(e);
      if (e !== undefined && e !== null) {
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
    return offsets;
  },

  checkOffsetValidity: function(kf) {
    let last = -1;
    for (let i = 0; i < kf.length; i++) {
      let { offset } = kf[i];
      if (offset < 0 || offset > 1 || offset <= last || last === 1) {
        return false;
      }
      if (offset) {
        last = offset;
      }
    }
    return true;
  },

  checkOffsetsValidity: function(offsets) {
    let last = -1;
    for (let i = 0; i < offsets.length; i++) {
      if (offsets[i] < 0 || offsets[i] > 1 || offsets[i] <= last || last === 1) {
        return false;
      }
      if (offsets[i]) {
        last = offsets[i];
      }
    }
    return true;
  }
};
