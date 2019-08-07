import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { keyF } from 'air-stream';
import { resolve } from 'path';

jest.setTimeout(10000);

describe(`Air Anima CSS`, () => {
  beforeAll(async () => {
    // setup
  });

  it('air-stream import check', async () => {
    await expect(keyF).toStrictEqual({ keyF: 'keyF' });
  });

  it('puppeteer check', async () => {
    await page.setContent('<p id="abc">123123</p>');
    await expect(page.$eval('#abc', el => parseInt(el.textContent))).resolves.toBe(123123);
  });
});