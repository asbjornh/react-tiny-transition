import React, { Children } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { canAnimate, resetClassList } from "./utils";

class TinyTransition extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    classNames: PropTypes.shape({
      beforeEnter: PropTypes.string,
      entering: PropTypes.string,
      beforeLeave: PropTypes.string,
      leaving: PropTypes.string
    }),
    disableInitialAnimation: PropTypes.bool,
    delay: PropTypes.number,
    duration: PropTypes.number.isRequired
  };

  static defaultProps = {
    children: null,
    classNames: {
      beforeEnter: "before-enter",
      entering: "entering",
      beforeLeave: "before-leave",
      leaving: "leaving"
    },
    duration: 500,
    delay: 0
  };

  state = {
    children: this.props.disableInitialAnimation ? this.props.children : null
  };

  animationTimer;
  delayTimer;
  isAnimating = false;
  raf;

  animateIn = ({ children, classNames, delay, duration }) => {
    const { beforeEnter, entering } = classNames;
    this.isAnimating = true;
    clearTimeout(this.delayTimer);

    this.delayTimer = setTimeout(() => {
      this.setState({ children }, () => {
        const node = ReactDOM.findDOMNode(this);

        if (node) {
          resetClassList(node, classNames);

          this.raf = requestAnimationFrame(() => {
            node.classList.add(beforeEnter);

            this.raf = requestAnimationFrame(() => {
              node.classList.add(entering);
            });

            clearTimeout(this.animationTimer);
            this.animationTimer = setTimeout(() => {
              resetClassList(node, classNames);
              this.isAnimating = false;
            }, duration);
          });
        }
      });
    }, delay);
  };

  animateOut = ({ children, classNames, delay, duration }) => {
    const { beforeLeave, leaving } = classNames;
    const node = ReactDOM.findDOMNode(this);

    if (node) {
      this.isAnimating = true;
      clearTimeout(this.delayTimer);

      this.delayTimer = setTimeout(() => {
        resetClassList(node, classNames);

        this.raf = requestAnimationFrame(() => {
          node.classList.add(beforeLeave);

          this.raf = requestAnimationFrame(() => {
            node.classList.add(leaving);
          });

          clearTimeout(this.animationTimer);
          this.animationTimer = setTimeout(() => {
            resetClassList(node, classNames);
            this.isAnimating = false;
            this.setState({ children });
          }, duration);
        });
      }, delay);
    }
  };

  componentDidMount() {
    if (
      this.props.children &&
      !this.props.disableInitialAnimation &&
      canAnimate(true)
    ) {
      this.raf = requestAnimationFrame(() => {
        this.animateIn(this.props);
      });
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.animationTimer);
    clearTimeout(this.delayTimer);
  }

  componentWillReceiveProps(nextProps) {
    const newChildren = Children.toArray(nextProps.children);
    const oldChildren = Children.toArray(this.props.children);

    if (newChildren.length !== oldChildren.length && canAnimate()) {
      // Element was added or removed
      if (newChildren.length) {
        // Element is about to mount
        this.animateIn(nextProps);
      } else {
        // Element is about to unmount
        this.animateOut(nextProps);
      }
    } else if (!this.isAnimating) {
      this.setState({
        children: nextProps.children
      });
    }
  }

  render() {
    return this.state.children;
  }
}

export default TinyTransition;
