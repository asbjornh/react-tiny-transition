# TinyTransition
[![npm version](https://img.shields.io/npm/v/react-tiny-transition.svg?style=flat)](https://www.npmjs.com/package/react-tiny-transition)

This component adds classnames to your component when it mounts/unmounts so that you can add css transitions to it. basically the same thing as CSSTransition from [react-transition-group](https://github.com/reactjs/react-transition-group), except smaller and without dependencies.

This component does not include any transition effects; you need to add your own. See example css below.

### Install:
```
yarn add react-tiny-transition
```
or

```
npm install react-tiny-transition
```


### Props:
- `duration` *(required)*: `Number`, the duration of your css transition in milliseconds
- `children` *(optional)*: `React component`, only one root node allowed
- `classNames` *(optional)*: `Object`, if the default classnames don't cut it, you can add your own here (see example below)

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

#### Custom classnames example:

```js
<TinyTransition
  classNames={{
    beforeEnter: "my-before-enter",
    entering: "my-entering",
    beforeLeave: "my-before-leave",
    leaving: "my-leaving"
  }}
  duration={500}
>
  {this.state.isVisible &&
    <MyComponent />
  }
</TinyTransition>
```