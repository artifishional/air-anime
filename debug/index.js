import animate from "../src/index";

// const stream1 = animate(
//   [{ node: document.querySelector("div#first.trololo-class-name"), type: "active" }],
//   [
//     [
//       "default",
//       () => ({ duration: 2 }),
//       [, () => ({ left: 100, top: 90 })],
//       [, () => ({ classList: { "ololo-class": 1 }, left: 200, top: 30 })],
//       [, () => ({ classList: { "trololo-class-name": 0 }, left: 300, top: 90 })],
//       [, () => ({ left: 400, top: 30 })]
//     ]
//   ]
// );

// const stream2 = animate(
//   [{ node: document.querySelector("div#second"), type: "active" }],
//   [
//     [
//       "bounce-left-right",
//       () => ({ duration: 3, easing: "easeInQuad" }),
//       [0, () => ({ left: 1000 })],
//       [0.1, () => ({ left: 500 })],
//       [0.2, () => ({ left: 0 })],
//       [0.3, () => ({ left: 500 })],
//       [0.4, () => ({ left: 0 })],
//       [0.7, () => ({ left: 500 })],
//       [1, () => ({ left: 0 })]
//     ]
//   ]
// );

// const stream3 = animate(
//   [{ node: document.querySelectorAll("div.grid"), type: "active" }],
//   [
//     [
//       "insane",
//       () => ({ duration: 3.5, easing: "spring(1, 80, 10, 0)" }),
//       [0.25, () => ({ scale: 3 })],
//       [
//         0.3,
//         data => ({
//           backgroundColor: `rgb(${data.colorRED}, ${data.colorGREEN}, ${data.colorBLUE})`
//         })
//       ],
//       [
//         0.6,
//         () => ({
//           scale: 1,
//           rotate: 315,
//           left: "+=500",
//           top: "+=0",
//           opacity: 0.5,
//           backgroundColor: "rgb(30, 144, 255)"
//         })
//       ],
//       [
//         1,
//         () => ({
//           opacity: 0,
//           top: 400,
//           backgroundColor: "rgb(255, 0, 0)"
//         })
//       ]
//     ]
//   ]
// );

// const stream4 = animate(
//   [{ node: "div#fourth", type: "active" }],
//   [
//     [
//       "not-from-the-beginning",
//       () => ({
//         duration: 5,
//         easing: "cubicBezier(.5, .05, .1, .3)",
//         start: 4
//       }),
//       [0.1, () => ({ left: 100 })],
//       [0.2, () => ({ left: 0 })],
//       [0.3, () => ({ left: 200 })],
//       [0.4, () => ({ left: 0 })],
//       [0.5, () => ({ left: 300 })],
//       [0.6, () => ({ left: 0 })],
//       [0.7, () => ({ left: 400 })],
//       [0.8, () => ({ left: 0 })],
//       [0.9, () => ({ left: 500 })],
//       [1, () => ({ left: 0 })]
//     ]
//   ]
// );

// const stream5 = animate(
//   [{ node: document.querySelector("div#fifth"), type: "active" }],
//   [
//     [
//       "default",
//       () => ({ duration: 2 }),
//       [, () => ({ left: 300 })],
//       [0.2, () => ({ left: 0 })],
//       [, () => ({ left: 300 })],
//       [, () => ({ left: 0 })]
//     ]
//   ]
// );

// const stream6 = animate(
//   [
//     {
//       node: document.customData.text1,
//       type: "data",
//       update: data => (document.customData.text1.textContent = Math.round(data.value))
//     },
//     {
//       node: document.customData.text2,
//       type: "data",
//       update: data => (document.customData.text2.textContent = Math.round(data.value))
//     }
//   ],
//   [
//     [
//       "default",
//       () => ({ duration: 2, easing: "linear" }),
//       [, () => ({ value: 50 })],
//       [, () => ({ value: 100 })],
//       [0.7, () => ({ value: 1000 })],
//       [, () => ({ value: 1000000 })]
//     ]
//   ]
// );

// const stream7 = animate([], [["empty", () => ({ duration: 2 }), [, () => ({ value: 0 })], [, () => ({ value: 100 })]]]);

// const stream8 = animate(
//   [{ node: document.querySelector("div#sixth"), type: "active" }],
//   [["default", () => ({ duration: 2 }), [, () => ({ left: 1000 })]]]
// );

// const connector1 = stream1.on(({ action }) => {
//   console.log(action, "complete");
// });
// const connector2 = stream2.on(({ action }) => {
//   console.log(action, "complete");
// });
// const connector3 = stream3.on(({ action }) => {
//   console.log(action, "complete");
// });
// const connector4 = stream4.on(({ action }) => {
//   console.log(action, "complete");
// });
// const connector5 = stream5.on(({ action }) => {
//   console.log(action, "complete");
// });
// const connector6 = stream6.on(({ action }) => {
//   console.log(action, "complete");
// });
// const connector7 = stream7.on(({ action }) => {
//   console.log(action, "complete");
// });
// const connector8 = stream8.on(({ action }) => {
//   console.log(action, "complete");
// });

// connector1({ data: [{}, { action: "default" }] });
// connector2({ data: [{}, { action: "bounce-left-right" }] });
// connector3({
//   data: [{ colorRED: 255, colorGREEN: 140, colorBLUE: 0 }, { action: "insane" }]
// });
// connector4({ data: [{}, { action: "not-from-the-beginning" }] });

// connector1({ data: [{}, { action: "not-exist" }] });

// connector5({ data: [{}, { action: "default" }] });

// connector6({ data: [{}, { action: "default" }] });

// connector7({ data: [{}, { action: "empty" }] });

// connector8({ data: [{}, { action: "default" }] });

// ********************
// popup

const hoverable = document.getElementById("hoverable");
const popup = document.getElementById("popup");

const popupstream = animate(
  [{ node: popup, type: "active" }],
  [
    [
      "fade-in",
      () => ({ duration: 1.25, easing: "linear" }),
      [0, () => ({ opacity: 0 })],
      [0.8, () => ({ opacity: 0 })],
      [1, () => ({ opacity: 1 })]
    ],
    ["fade-out", () => ({ duration: 5.25, easing: "linear" }), [1, () => ({ opacity: 0 })]]
  ]
);

const popupconnector = popupstream.on(({ action }) => {
  console.log(action, "complete");
  popupconnector();
});

hoverable.addEventListener("mouseover", () => {
  popupconnector({ data: [{}, { action: "fade-in" }] });
});
hoverable.addEventListener("mouseout", () => {
  popupconnector({ data: [{}, { action: "fade-out" }] });
});
