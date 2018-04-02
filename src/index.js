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

  clearTimers = () => {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.animationTimer);
    clearTimeout(this.delayTimer);
  };

  animateIn = () => {
    if (!canAnimate()) {
      this.setState({ children: this.props.children });
      return;
    }

    this.isAnimating = true;
    this.clearTimers();

    this.delayTimer = setTimeout(() => {
      this.setState({ children: this.props.children }, () => {
        const node = ReactDOM.findDOMNode(this);
        const { classNames } = this.props;

        if (node) {
          resetClassList(node, classNames);

          this.raf = requestAnimationFrame(() => {
            node.classList.add(classNames.beforeEnter);

            this.raf = requestAnimationFrame(() => {
              node.classList.add(classNames.entering);
            });

            this.animationTimer = setTimeout(() => {
              resetClassList(node, classNames);
              this.isAnimating = false;
            }, this.props.duration);
          });
        }
      });
    }, this.props.delay);
  };

  animateOut = () => {
    if (!canAnimate()) {
      this.setState({ children: this.props.children });
      return;
    }

    const node = ReactDOM.findDOMNode(this);
    const { classNames } = this.props;

    if (node) {
      this.isAnimating = true;
      this.clearTimers();

      this.delayTimer = setTimeout(() => {
        resetClassList(node, classNames);

        this.raf = requestAnimationFrame(() => {
          node.classList.add(classNames.beforeLeave);

          this.raf = requestAnimationFrame(() => {
            node.classList.add(classNames.leaving);
          });

          this.animationTimer = setTimeout(() => {
            resetClassList(node, classNames);
            this.isAnimating = false;
            this.setState({ children: this.props.children });
          }, this.props.duration);
        });
      }, this.props.delay);
    }
  };

  componentDidMount() {
    if (this.props.children && !this.props.disableInitialAnimation) {
      this.raf = requestAnimationFrame(() => {
        this.animateIn();
      });
    }
  }

  componentWillUnmount() {
    this.clearTimers();
  }

  componentDidUpdate(prevProps) {
    const newChildren = Children.toArray(this.props.children);
    const oldChildren = Children.toArray(prevProps.children);

    if (newChildren.length !== oldChildren.length) {
      if (newChildren.length) {
        this.animateIn();
      } else {
        this.animateOut();
      }
    } else if (
      this.props.children !== this.state.children &&
      !this.isAnimating
    ) {
      this.setState({ children: this.props.children });
    }
  }

  render() {
    return this.state.children;
  }
}

export default TinyTransition;
