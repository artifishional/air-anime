import '@babel/polyfill';
import { resolve } from 'path';

const path = resolve('.');

const delay = (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};

describe('Air Anima CSS', () => {
  beforeAll(async () => {
    await page.goto(`file://${path}/debug/index.html`);
    await page.click('#gotoExamples'); // click for enable sounds
  });

  it('should be titled "Title"', async () => {
    await expect(page.title()).resolves.toMatch('Title');
  });

  it('control text on hover', async () => {
    await page.hover('#controlText');
    await delay(100);
    await expect(page.$eval('#textForwBack', el => parseInt(el.textContent))).resolves.toBeGreaterThan(0);
    // await page.hover('#dummy');
    // await delay(300);
    // await expect(page.$eval('#textForwBack', el => parseInt(el.textContent))).resolves.toBe(0);
  });
});