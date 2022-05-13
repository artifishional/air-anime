import animate from "../src/index.mjs";
import {Howl} from "Howler";

const streamCheckKeyframes = animate(
    [{node: document.querySelector("div#seventh"), type: "active"}],
    [
        [
            "default",
            () => ({duration: 5, start: 1}),
            [0, () => ({left:0})],
            [0.5, () => ({left:400})],
            [1, () => ({left:50})]
        ],
        [
            "default",
            () => ({duration: 20, easing:'linear'}),
            [0, () => ({opacity:1})],
            [1, () => ({opacity:0})]
        ]
    ]
);

const streamCheckTransform = animate(
    [{node: document.querySelector("div#eight"), type: "active"}],
    [
        [
            "default",
            () => ({duration: 5}),
            [0, () => ({scaleX:1, left:10})],
            [0.25, () => ({scaleX:2, left:100})],
            [1, () => ({scaleX:1.5, left:10})]
        ],
        [
            "default",
            () => ({duration: 5}),
            [0, () => ({scaleY:1.5})],
            [0.25, () => ({scaleY:2})],
            [0.5, () => ({scaleY:3})],
            [1, () => ({scaleY:1})]
        ],
        [
            "default",
            () => ({duration: 6, start: 1}),
            [0, () => ({opacity:1})],
            [0.25, () => ({opacity:0.5})],
            [0.75, () => ({opacity:0})],
            [1, () => ({opacity:1})]
        ]
    ]
);

const streamCheckStart = animate(
    [{node: document.querySelector("div#eight"), type: "active"}],
    [
        [
            "default",
            () => ({duration: 5,start:4}),
            [0, () => ({scaleX:1, left:10})],
            [0.25, () => ({scaleX:2, left:100})],
            [1, () => ({scaleX:1.5, left:10})]
        ],
    ]
);

const stream1 = animate(
    [{node: document.querySelector("div#first.trololo-class-name"), type: "active"}],
    [
        [
            "default",
            () => ({duration: 2}),
            [, () => ({left: 100, top: 90})],
            [, () => ({classList: {"ololo-class": 1}, left: 200, top: 30})],
            [, () => ({classList: {"trololo-class-name": 0}, left: 300, top: 90})],
            [, () => ({left: 400, top: 30})]
        ]
    ]
);

const stream2 = animate(
    [{node: document.querySelector("div#second"), type: "active"}],
    [
        [
            "bounce-left-right",
            () => ({duration: 3, easing: "easeInQuad"}),
            [0, () => ({left: 1000})],
            [0.1, () => ({left: 500})],
            [0.2, () => ({left: 0})],
            [0.3, () => ({left: 500})],
            [0.4, () => ({left: 0})],
            [0.7, () => ({left: 500})],
            [1, () => ({left: 0})]
        ]
    ]
);

const stream3 = animate(
    [{node: document.querySelectorAll("div.grid"), type: "active"}],
    [
        [
            "insane",
            () => ({duration: 3.5, easing: "spring(1, 80, 10, 0)"}),
            [0.25, () => ({scale: 3})],
            [
                0.3,
                data => ({
                    backgroundColor: `rgb(${data.colorRED}, ${data.colorGREEN}, ${data.colorBLUE})`
                })
            ],
            [
                0.6,
                () => ({
                    scale: 1,
                    rotate: 315,
                    left: "+=500",
                    top: "+=0",
                    opacity: 0.5,
                    backgroundColor: "rgb(30, 144, 255)"
                })
            ],
            [
                1,
                () => ({
                    opacity: 0,
                    top: 400,
                    backgroundColor: "rgb(255, 0, 0)"
                })
            ]
        ]
    ]
);

const stream4 = animate(
    [{node: "div#fourth", type: "active"}],
    [
        [
            "not-from-the-beginning",
            () => ({
                duration: 5,
                easing: "cubicBezier(.5, .05, .1, .3)",
                start: 4
            }),
            [0.1, () => ({left: 100})],
            [0.2, () => ({left: 0})],
            [0.3, () => ({left: 200})],
            [0.4, () => ({left: 0})],
            [0.5, () => ({left: 300})],
            [0.6, () => ({left: 0})],
            [0.7, () => ({left: 400})],
            [0.8, () => ({left: 0})],
            [0.9, () => ({left: 500})],
            [1, () => ({left: 0})]
        ]
    ]
);

const stream5 = animate(
    [{node: document.querySelector("div#fifth"), type: "active"}],
    [
        [
            "default",
            () => ({duration: 2}),
            [, () => ({left: 300})],
            [0.2, () => ({left: 0})],
            [, () => ({left: 300})],
            [, () => ({left: 0})]
        ]
    ]
);

const stream6 = animate(
    [
        {
            node: document.customData.text1,
            type: "data",
            update: data => (document.customData.text1.textContent = Math.round(data.value))
        },
        {
            node: document.customData.text2,
            type: "data",
            update: data => (document.customData.text2.textContent = Math.round(data.value))
        }
    ],
    [
        [
            "default",
            () => ({duration: 2, easing: "linear"}),
            [, () => ({value: 50})],
            [, () => ({value: 100})],
            [0.7, () => ({value: 1000})],
            [, () => ({value: 1000000})]
        ]
    ]
);

const stream7 = animate([], [["empty", () => ({duration: 2}), [, () => ({value: 0})], [, () => ({value: 100})]]]);

const stream8 = animate(
    [{node: document.querySelector("div#sixth"), type: "active"}],
    [["default", () => ({duration: 2}), [, () => ({left: 1000})]]]
);

const connector1 = stream1.on(({action}) => {
    console.log(action, "complete");
});
const connector2 = stream2.on(({action}) => {
    console.log(action, "complete");
});
const connector3 = stream3.on(({action}) => {
    console.log(action, "complete");
});
const connector4 = stream4.on(({action}) => {
    console.log(action, "complete");
});
const connector5 = stream5.on(({action}) => {
    console.log(action, "complete");
});
const connector6 = stream6.on(({action}) => {
    console.log(action, "complete");
});
const connector7 = stream7.on(({action}) => {
    console.log(action, "complete");
});
const connector8 = stream8.on(({action}) => {
    console.log(action, "complete");
});
const connector9 = streamCheckKeyframes.on(({action}) => {
    console.log(action, "complete");
});
const connector10 = streamCheckTransform.on(({action}) => {
    console.log(action, "complete");
});


document.addEventListener('click', (evt) => {
    switch (evt.target.id) {
        case 'start1':
            connector1({data: [{}, {action: "default"}]});
            break;
        case 'start2':
            connector2({data: [{}, {action: "bounce-left-right"}]});
            break;
        case 'start3':
            connector3({
                data: [{colorRED: 255, colorGREEN: 140, colorBLUE: 0}, {action: "insane"}]
            });
            break;
        case 'start4':
            connector4({data: [{}, {action: "not-from-the-beginning"}]});
            break;
        case 'start5':
            connector9({data: [{}, {action: "default"}]});
            break;
        case 'start6':
            connector10({data: [{}, {action: "default"}]});
            break;
    }
});


connector1({data: [{}, {action: "not-exist"}]});

connector5({data: [{}, {action: "default"}]});

connector6({data: [{}, {action: "default"}]});

connector7({data: [{}, {action: "empty"}]});

connector8({data: [{}, {action: "default"}]});

// ********************
// popup

const hoverable = document.getElementById("hoverable");
const popup = document.getElementById("popup");

const popupstream = animate(
    [{node: popup, type: "active"}],
    [
        [
            "fade-in",
            () => ({duration: 1.25, easing: "linear"}),
            [0.8, () => ({opacity: 0})],
            [1, () => ({opacity: 1})]
        ],
        ["fade-out", () => ({duration: 0.25, easing: "linear"}), [1, () => ({opacity: 0})]]
    ]
);

let resources = [];

function loadSound(url) {
    return new Promise(resolve => {
        const sound = new Howl({
            src: [`${url}.mp3`, `${url}.ogg`],
            onload: () => {
                resources.push({name: url, type: 'sound', sound});
                resolve();
            }
        });

    });
}

Promise.all([loadSound('./example'), loadSound('./time')]).then(() => {
    const soundBlock = document.getElementById("sound");

    const soundstream = animate([{node: soundBlock, type: 'sound', resources}],
        [
            ['playsound', () => ({duration: 1}),
                [0.2, () => ({sound: './time'})],
                [0.7, () => ({sound: './time'})],
            ],
            ['immediate', () => ({duration: -1, sound: './example'})]
        ]
    );

    const soundconnector = soundstream.on(({action}) => {
        console.log(action);
    });

    soundBlock.addEventListener("mouseover", () => {
        soundconnector({data: [{}, {action: "playsound"}]});
        soundconnector({data: [{}, {action: "immediate"}]});
    });
    soundBlock.addEventListener("mouseover", () => {
        soundconnector({data: [{}, {action: "immediate"}]});
    });
});

const popupconnector = popupstream.on(({action}) => {
    console.log(action, "complete");
});

hoverable.addEventListener("mouseover", () => {
    popupconnector({data: [{}, {action: "fade-in"}]});
});
hoverable.addEventListener("mouseout", () => {
    popupconnector({data: [{}, {action: "fade-out"}]});
});

// ********************
// text forward - back

document.customData.forwBackText = new Text("0");
const p = document.createElement("p");
p.id = "textForwBack";
p.append(document.customData.forwBackText);
document.body.append(p);
const controlText = document.getElementById("controlText");

const textstream = animate(
    [
        {
            node: document.customData.forwBackText,
            type: "data",
            update: data => (document.customData.forwBackText.textContent = Math.round(data.value))
        }
    ],
    [
        ["forward", () => ({duration: 2, easing: "linear"}), [1, () => ({value: 1000})]],
        ["back", () => ({duration: 2, easing: "linear"}), [1, () => ({value: 0})]]
    ]
);

const textconnector = textstream.on(({action}) => {
    console.log(action, "complete");
});

controlText.addEventListener("mouseover", () => {
    textconnector({data: [{}, {action: "forward"}]});
});
controlText.addEventListener("mouseout", () => {
    textconnector({data: [{}, {action: "back"}]});
});
