import {stream2 as stream} from "air-stream";
import utils from './utils';

export default (view, frames, layer) => {
    return stream(null, (e, ctr) => {
        const resources = view.flatMap(({ resources }) => resources).filter(({ type }) => type === 'sound').filter((v, i, a) => a.indexOf(v) === i);

        let timers = [];
        let sounds = [];

        const state = {};

        function updateAll (data) {
            view.map(v => v.update(data));
        }

        function animationClear () {
            sounds.forEach(({ sound, id }, i) => {
                if (sound) {
                    sound.stop(id);
                    sounds[i].sound = null
                }
            });

            timers.forEach((timer) => clearTimeout(timer));
            timers = [];
        }

        ctr.todisconnect(animationClear);

        ctr.tocommand(({ data: [data, { action = 'default' }] } = {}) => {

            const keyframe = frames.find(([name]) => name === action);

            if (!keyframe) {
                updateAll(data);
                e({ action: `${action}-complete` });
                return;
            }

            const prop = keyframe[1] ? keyframe[1](data) : {};

            const keys = keyframe.slice(2).map(([offset, prop]) => ({
                offset,
                ...prop(data)
            }));

            const soundNames = keys.map(key => key.sound).filter(Boolean)
            if (!soundNames.length) {
                return;
            }

            if (!utils.checkOffsetValidity(keys)) {
                throw 'Error: animation error, keyframe offset wrong. Valid offset: >= 0, <= 1, ascending order.';
            }

            const keyframes = new Map();
            const duration = prop.duration * 1000 || 0;
            const start = prop.start * 1000 || 0;

            if (!duration) {
                resources.filter(({ name }) => soundNames.indexOf(name) > -1).forEach(({ sound }) => {
                    sound.play();
                    e({ action: `${action}-complete` });
                });
            } else {
                if (start >= duration && duration !== 0) {
                    throw 'Error: animation start time cannot be greater or equal than animation duration.';
                }

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

                [...keyframes].filter(([key, value]) => key === 'sound').forEach(([, value]) => {
                    value.forEach(({ value: url, duration }) => {
                        resources.filter(({ name }) => url === name).forEach(({ sound }) => {
                            const timer = setTimeout(() => {
                                const id = sound.play();
                                sounds.push({ id, sound });
                                sound.on('end', () => {
                                    clearTimeout(timer);
                                });
                            }, duration);
                            timers.push(timer);
                        });
                    });
                });
                setTimeout(() => {
                    animationClear();
                    e({ action: `${action}-complete` });
                }, duration);
            }
        });
    });
};
