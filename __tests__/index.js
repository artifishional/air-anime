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
            div.setAttribute('id', 'pain');
            document.body.appendChild(div);

            const anime = animate(
                [{node: div, type: 'active'}],
                [
                    [
                        "default",
                        () => ({duration: 2}),
                        [0, () => ({left: 0})],
                        [0.5, () => ({left: 400})],
                        [1, () => ({left: 50})]
                    ],
                    [
                        "default",
                        () => ({duration: 5, easing: 'linear'}),
                        [0, () => ({opacity: 1})],
                        [1, () => ({opacity: 0})]
                    ]
                ]
            );
            const connector = anime.on((evt) => {
            });
            connector({data: [{}, {action: 'default'}]});
        });

        await page.waitFor(2100);
        await expect(page.$eval('#pain', el => el.style.left)).resolves.toBe('50px');

        await page.waitFor(3000);
        await expect(page.$eval('#pain', el => el.style.opacity)).resolves.toBe('0');

        await page.setContent('');
    });

    it('with start', async () => {
        await page.evaluate(() => {
            const div = document.createElement('div');
            div.setAttribute('id', 'pain');
            document.body.appendChild(div);

            const anime = animate(
                [{node: div, type: 'active'}],
                [
                    [
                        "default",
                        () => ({duration: 5,start:4}),
                        [0, () => ({scaleX:1, left:20})],
                        [0.25, () => ({scaleX:2, left:100})],
                        [1, () => ({scaleX:1.5, left:10})]
                    ],
                ]
            );
            const connector = anime.on((evt) => {
            });
            connector({data: [{}, {action: 'default'}]});
        });

        await page.waitFor(1100);
        await expect(page.$eval('#pain', el => el.style.left)).resolves.toBe('10px');
        await expect(page.$eval('#pain', el => el.style.transform)).resolves.toBe('scaleX(1.5)');

        await page.setContent('');
    });

    it('a few transforms', async () => {
        await page.evaluate(() => {
            const div = document.createElement('div');
            div.setAttribute('id', 'pain');
            document.body.appendChild(div);

            const anime = animate(
                [{node: div, type: 'active'}],
                [
                    [
                        "default",
                        () => ({duration: 1}),
                        [0, () => ({scaleX:1, left:20})],
                        [0.25, () => ({scaleX:2, left:100})],
                        [1, () => ({scaleX:1.5, left:10})]
                    ],
                    [
                        "default",
                        () => ({duration: 1}),
                        [0, () => ({scaleY:1.5})],
                        [0.25, () => ({scaleY:2})],
                        [0.5, () => ({scaleY:3})],
                        [1, () => ({scaleY:1})]
                    ],
                    [
                        "default",
                        () => ({duration: 2, start: 1}),
                        [0, () => ({opacity:1})],
                        [0.25, () => ({opacity:0.5})],
                        [0.75, () => ({opacity:0})],
                        [1, () => ({opacity:1})]
                    ]
                ]
            );
            const connector = anime.on((evt) => {});
            connector({data: [{}, {action: 'default'}]});
        });

        await page.waitFor(1100);
        await expect(page.$eval('#pain', el => Math.round(parseFloat(el.style.left)))).resolves.toBe(10);
        await expect(page.$eval('#pain', el => Math.round(parseFloat(el.style.opacity)))).resolves.toBe(1);
        await expect(page.$eval('#pain', el => {
            return el.style.transform;
        })).resolves.toBe('scaleX(1.5) scaleY(1)');


        await page.setContent('');
    });

    it('without offsets', async () => {
        await page.evaluate(() => {
            const div = document.createElement('div');
            div.setAttribute('id', 'pain');
            document.body.appendChild(div);

            const anime = animate(
                [{node: div, type: 'active'}],
                [
                    [
                        "default",
                        () => ({duration: 1}),
                        [, () => ({left: 100, top: 90})],
                        [, () => ({classList: {"ololo-class": true}, left: 200, top: 30})],
                        [, () => ({classList: {"trololo-class-name": true, "ololo-class": false}, left: 300, top: 90})],
                        [, () => ({left: 400, top: 30})]
                    ]
                ]
            );
            const connector = anime.on((evt) => {
            });
            connector({data: [{}, {action: 'default'}]});
        });

        await page.waitFor(1100);
        await expect(page.$eval('#pain', el => el.style.left)).resolves.toBe('400px');
        await expect(page.$eval('#pain', el => el.style.top)).resolves.toBe('30px');
        await expect(page.$eval('#pain', el => el.classList.contains('trololo-class-name'))).resolves.toBeTruthy();
        await expect(page.$eval('#pain', el => el.classList.contains('ololo-class'))).resolves.toBeFalsy();

        await page.setContent('');
    });

    it('without a few offsets', async () => {
        await page.evaluate(() => {
            const div = document.createElement('div');
            div.setAttribute('id', 'pain');
            document.body.appendChild(div);

            const anime = animate(
                [{node: div, type: 'active'}],
                [
                    [
                        "default",
                        () => ({duration: 2, easing: 'linear'}),
                        [, () => ({left: 300})],
                        [0.2, () => ({left: 0})],
                        [, () => ({left: 300})],
                        [, () => ({left: 0})]
                    ]
                ]
            );
            const connector = anime.on((evt) => {});

            connector({data: [{}, {action: 'default'}]});
        });

        await page.waitFor(2100);
        await expect(page.$eval('#pain', el => el.style.left)).resolves.toBe('0px');

        await page.setContent('');

    });

    it('classes toggle', async () => {
        await page.evaluate(() => {
            const div = document.createElement('div');
            div.setAttribute('id', 'pain');
            document.body.appendChild(div);

            const anime = animate(
                [{node: div, type: 'active'}],
                [
                    [
                        "default",
                        () => ({duration: 1, easing: 'linear'}),
                        [, () => ({classList: {"first": true}})],
                        [0.2, () => ({classList: {"second": true}})],
                        [, () => ({classList: {"third": true}})],
                        [, () => ({classList: {"fourth": true}})]
                    ]
                ]
            );
            const connector = anime.on((evt) => {});

            connector({data: [{}, {action: 'default'}]});
        });

        await page.waitFor(150);
        await expect(page.$eval('#pain', el => el.classList.contains('first'))).resolves.toBeTruthy();
        await expect(page.$eval('#pain', el => el.classList.contains('second'))).resolves.toBeFalsy();

        await page.waitFor(250);
        await expect(page.$eval('#pain', el => el.classList.contains('first'))).resolves.toBeTruthy();
        await expect(page.$eval('#pain', el => el.classList.contains('second'))).resolves.toBeTruthy();
        await expect(page.$eval('#pain', el => el.classList.contains('third'))).resolves.toBeFalsy();
        //
        // await page.waitFor(650);
        // await expect(page.$eval('#pain', el => el.classList.contains('first'))).resolves.toBeTruthy();
        // await expect(page.$eval('#pain', el => el.classList.contains('second'))).resolves.toBeTruthy();
        // await expect(page.$eval('#pain', el => el.classList.contains('third'))).resolves.toBeTruthy();
        // await expect(page.$eval('#pain', el => el.classList.contains('fourth'))).resolves.toBeFalsy();


        await page.setContent('');

    });

});