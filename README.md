# air-anime

Powered by `anime.js` library
https://animejs.com/
https://github.com/juliangarnier/anime/

## Using

Animation function `animate()`. Gets list of targets and list of animations. Each animation has its name and set of properties.

### Template

```javascript
animate([targets], [["animation_name", data => ({ data_set }), ...keys]]);
```

### Sample

```javascript
const stream = animate(
  [{ node: "div#block", type: "active" }],
  [
    [
      "default",
      data => ({ duration: 3000, easing: "linear", start: 1000 }),
      [, data => ({ left: 100 })], // empty offset
      [0.5, data => ({ left: data.left, top: data.top })]
    ],
    ["fade-in", data => ({ duration: 1000 }), [1, data => ({ opacity: 1 })]]
  ]
);

const connector = stream.on(({ action }) => {
  // popup on action
});

// animation call
connector({ data: [{ left: 300, top: 100 }, { action: "action_name" }] });

// unsubscribing
connector();
```

### Targets

`targets` are instance of Object

- _node_: element(s) from supported list below; have to be only one type
- _type_: supported `"active"` for CSS-animated elements or `"data"` for Text Nodes
- _update_: function, for `"data"` type only, gets `data` object; runs on every animation tick

#### Target example

```javascript
  { node: "div#block", type: "active" }
```

```javascript
  const text = new Text();
  { node: text, type: "data", update: data => text.textContent = data.value }
```

```javascript
  { node: "div#block", type: "sound", resources: [Howl, ...] }
```

#### Supported targets

- _CSS selector_: `".item"`
- _DOM Node_: `el.querySelector(".item")`
- _NodeList_: `el.querySelectorAll(".item")`
- _Array_: mixed types, e.g. `[".el", el.getElementById("#elem")]`
- _Text Node_: `new Text("some text")`

### Data set properties

instance of Object

- _duration_: full animation duration time (in sec). 0 default (means animation will not be played, last frame applied immediatly)
- _easing_: easing timing (see this page: https://animejs.com/documentation/#linearEasing for more details). "easeOutElastic(1, .5)" default.
- _start_: time to start animation from (in sec). 0 default. Cannot be greater or equal animation duration.

### Keys properties

Each keyframe is instance of Array

- _0 index (offset)_: value between 0 and 1 (including) ascending order, refers to CSS `@keyframes` percentage, where 0 - the very start of animation and 1 - its ending.
- _1 index (properties)_: function, gets `data`, returns object of DOM object properties to animate 'till this keyframe, refers to CSS properties.

#### 0-index offset

If the first found `offset` value is 0 its keyframe properties will be set to DOM object immediatly before animation start.
If there is no `offset` property specified inside all the keyframes, each keyframe duration will be equal to the animation total duration divided by the number of keyframes.
If there is no `offset` property specified inside some of keyframes, missing will be calculated.

#### 1-index properties

Animatable properties, e.g. left, top, opacity, scaleX, color, backgroundColor etc.

Each keyframe may contain unique property `classList`. It will _not be animated_ and has format of: `classList: { "class-name": valid-boolean-value }`. The idea is to toggle class-name on animation targets after the end of this keyframe.
