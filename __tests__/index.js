import 'core-js/stable';
import 'regenerator-runtime/runtime';

jest.setTimeout(100000);

describe(`Air Anima CSS`, () => {
  beforeAll(async () => {
    await page.addScriptTag({
      path: './dist/bundle.js',
    });
  });

  it('more then 1 keyframe', async () => {

    await page.evaluate(() => {
      const div = document.createElement('div');
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

    });
    await page.waitFor(1000);
    await expect(page.$eval('div', el => +el.style.height.replace('px',''))).resolves.toBeGreaterThanOrEqual(50);
    await page.waitFor(2000);
    await expect(page.$eval('div', el => +el.style.height.replace('px',''))).resolves.toEqual(100);
    await page.setContent('');
  });

});