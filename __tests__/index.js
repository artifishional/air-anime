import 'core-js/stable';
import 'regenerator-runtime/runtime';
import animate from '../src';

jest.setTimeout(100000);

const waitFor = (delay) => new Promise((resolve => setTimeout(resolve, delay)));

describe(`Air Anima CSS`, () => {
  it('more then 1 keyframe', async () => {

    const div = document.createElement('div');
    div.style.height = '0px';
    document.body.appendChild(div);

    const anime = animate(
      [{ node: div, type: 'active' }],
      [
        [
          'default',
          () => ({ duration: 4, start: 1 }),
          [undefined, () => ({ height: 50 })],
          [undefined, () => ({ height: 100 })]
        ]
      ]
    );
    const connector = anime.on((evt) => {});
    connector({ data: [{}, { action: 'default' }] });

    await waitFor(1100);
    await expect(+div.style.height.replace('px', '')).toBeGreaterThanOrEqual(50);
    await waitFor(2100);
    await expect(+div.style.height.replace('px', '')).toEqual(100);

  });
});