import '@babel/polyfill';
import { resolve } from 'path';

const path = resolve('.');

jest.setTimeout(10000);

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
    await page.waitFor(100);
    await expect(page.$eval('#textForwBack', el => parseInt(el.textContent))).resolves.toBeGreaterThan(0);
    await page.mouse.click(1, 1);
    await page.waitFor(2500);
    await expect(page.$eval('#textForwBack', el => parseInt(el.textContent))).resolves.toBe(0);
  });

  it('equal kfs', async () => {
    await page.click('#start1');
    await expect(page.$eval('#first', el => el.classList.contains('trololo-class-name'))).resolves.toBeTruthy();
    await page.waitFor(1100);
    await expect(page.$eval('#first', el => el.classList.contains('ololo-class'))).resolves.toBeTruthy();
    await page.waitFor(500);
    await expect(page.$eval('#first', el => el.classList.contains('trololo-class-name'))).resolves.toBeFalsy();
    await page.waitFor(500);
    await expect(page.$eval('#first', el => el.offsetLeft)).resolves.toBe(400);
    await expect(page.$eval('#first', el => el.offsetTop)).resolves.toBe(30);
  });
});