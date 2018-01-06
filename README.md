# TinyTransition

[![npm version](https://img.shields.io/npm/v/react-tiny-transition.svg?style=flat)](https://www.npmjs.com/package/react-tiny-transition)

This component adds classnames to your component when it mounts/unmounts so that you can add css transitions to it. basically the same thing as CSSTransition from [react-transition-group](https://github.com/reactjs/react-transition-group), except smaller and without dependencies.

This component does not include any transition effects; you need to add your own. See example css below.

### Browser support:
TinyTransition needs `requestAnimationFrame` and `element.classList` in order to do its thing, so make sure to add polyfills if you need to support older browsers (like IE9 and below).

### Install:

```
yarn add react-tiny-transition
```

or

```
npm install react-tiny-transition
```

### Props:

| Prop         | Type          | Default | Description                                                                       |
| ------------ | ------------- | --------- | --------------------------------------------------------------------------------- |
| `duration`   | Number        | 500       | The duration of your css transition (milliseconds)                              |
| `delay`      | Number        | 0         | Delay before adding classnames (milliseconds)
| `children`   | React element |         | Single React element
| `classNames` | Object        | <pre>{<br>  beforeEnter: "before-enter",<br>  entering: "entering",<br>  beforeLeave: "before-leave",<br>  leaving: "leaving"<br>}</pre>    | Classnames to use when mounting / unmounting |


#### Basic example:

```js
import TinyTransition from "react-tiny-transition";

...

<TinyTransition duration={500}>
  {this.state.isVisible &&
    <MyComponent />
  }
</TinyTransition>
```


#### CSS example:

```css
.before-enter {
  opacity: 0;
}

.entering {
  transition: opacity 0.5s;
  opacity: 1;
}

.before-leave {
  transition: opacity 0.5s;
}

.leaving {
  opacity: 0;
}
```

#### Multiple elements:
In order to keep TinyTransition as tiny as possible, one child only will get classnames applied. If you want to use TinyTransition on a list or something, you can wrap each child in a TinyTransition instance:

```js
{myItems.map(item => (
  <TinyTransition key={item.id}>
    <div>{item.text}</div>
  </TinyTransition>
}
```

