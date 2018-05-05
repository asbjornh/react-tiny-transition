# TinyTransition

[![npm version](https://img.shields.io/npm/v/react-tiny-transition.svg?style=flat)](https://www.npmjs.com/package/react-tiny-transition)

This component adds classnames to your component when it mounts/unmounts so that you can add css transitions to it. basically the same thing as CSSTransition from [react-transition-group](https://github.com/reactjs/react-transition-group), except smaller and without dependencies.

This component does not include any transition effects; you need to add your own. See example css below.

### Browser support:
TinyTransition needs `requestAnimationFrame` and `element.classList` in order to do its thing, so make sure to add polyfills if you need to support older browsers (like IE9 and below).

### Other Tiny libraries
* [react-tiny-crossfade](https://github.com/asbjornh/react-tiny-crossfade)
* [react-tiny-collapse](https://github.com/asbjornh/react-tiny-collapse)


### Install:

```
npm install react-tiny-transition
```

## API:

**duration** : Number = `500`
<br/>The duration of your css transition (milliseconds)

---


**disableInitialAnimation** : Boolean = `false`
<br/>Disable the animation when TinyTransition mounts

---

**delay** : Number = `0`
<br/>Delay before adding classnames (milliseconds)

---

**children** : React element
<br/>Single React element

---

**classNames**:  Object
<br/>Default:

```js
{
	beforeEnter: "before-enter",
	entering: "entering",
	beforeLeave: "before-leave",
	leaving: "leaving"
}
```
Classnames to use when mounting / unmounting

---


## Basic example:

```js
import TinyTransition from "react-tiny-transition";

...

<TinyTransition duration={500}>
  {this.state.isVisible &&
    <MyComponent />
  }
</TinyTransition>
```


## CSS example:

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

## Multiple elements:
In order to keep TinyTransition as tiny as possible, one child only will get classnames applied. If you want transitions on lists of things, you could try [react-flip-move](https://github.com/joshwcomeau/react-flip-move) or [react-flip-motion](https://github.com/asbjornh/react-flip-motion).

