import { stream } from 'air-stream';
import utils from './utils';

export default (view, frames, layer) => {
    return stream((emt, { sweep, hook }) => {
        if (!view.map(({ type }) => type).every(e => e === 'sound')) {
            throw 'Error: expected all nodes to have type `sound`';
        }

        const resources = view.flatMap(({ resources }) => resources).filter(({ type }) => type === 'sound');

        let timers = [];
        let sounds = [];

        const state = {};

        function updateAll (data) {
            view.map(v => v.update(data));
        }

        function animationClear () {
            // resources.forEach(({ sound }) => {
            //     sound.stop();
            // });

            sounds.forEach((sound, i) => {
                if (sound) {
                    sound.sound.stop(sound.id)
                    sounds[i] = null
                }
            });

            timers.forEach((timer) => clearTimeout(timer));
            timers = [];
        }

        sweep.add(animationClear);

        hook.add(({ data: [data, { action = 'default' }] } = {}) => {

            const keyframe = frames.find(([name]) => name === action);

            if (!keyframe) {
                updateAll(data);
                emt({ action: `${action}-complete` });
                return;
            }

            const prop = keyframe[1](data);

            const keys = keyframe.slice(2).map(([offset, prop]) => ({
                offset,
                ...prop(data)
            }));

            if (!utils.checkOffsetValidity(keys)) {
                throw 'Error: animation error, keyframe offset wrong. Valid offset: >= 0, <= 1, ascending order.';
            }

            const keyframes = new Map();
            const duration = prop.duration * 1000 || 0;
            const start = prop.start * 1000 || 0;

            if (prop.duration === -1) {
                resources.filter(({ url }) => prop.sound === url).forEach(({ sound }) => {
                    // sound.stop();
                    sound.play();
                    emt({ action: `${action}-complete` });
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
                    value.forEach(({ value: soundUrl, duration }) => {
                        resources.filter(({ url }) => soundUrl === url).forEach(({ sound }) => {
                            const timer = setTimeout(() => {
                                // sound.stop();
                                let soundId = sound.play();
                                sounds.push({ soundId, sound });
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
                    emt({ action: `${action}-complete` });
                }, duration);
            }
        });
    });
};
