import React, { Component, Children } from "react";
import PropTypes from "prop-types";

const propTypes = {
  children: PropTypes.node,
  classNames: PropTypes.shape({
    beforeEnter: PropTypes.string,
    entering: PropTypes.string,
    beforeLeave: PropTypes.string,
    leaving: PropTypes.string
  }),
  duration: PropTypes.number.isRequired
};

class TinyTransitionWrapper extends Component {
  static propTypes = propTypes;

  state = {
    children: this.props.children
  };

  timer;

  componentWillReceiveProps(nextProps) {
    const newChildren = Children.toArray(nextProps.children);
    const oldChildren = Children.toArray(this.props.children);

    if (newChildren.length < oldChildren.length) {
      this.setState(
        {
          children: oldChildren.map(
            (oldChild, index) =>
              newChildren.every(newChild => newChild.key !== oldChild.key)
                ? null
                : this.props.children[index]
          )
        },
        () => {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.setState({ children: nextProps.children });
          }, this.props.duration);
        }
      );
    } else {
      clearTimeout(this.timer);
      this.setState({ children: nextProps.children });
    }
  }

  render() {
    return Children.map(this.state.children, child => {
      return (
        <TinyTransition
          duration={this.props.duration}
          classNames={this.props.classNames}
        >
          {child}
        </TinyTransition>
      );
    });
  }
}

const transitionStates = {
  beforeEnter: "before-enter",
  entering: "entering",
  beforeLeave: "before-leave",
  leaving: "leaving"
};

function cn(...classNames) {
  return [...classNames].filter(className => !!className).join(" ");
}

class TinyTransition extends Component {
  static propTypes = propTypes;

  state = {
    children: this.props.children,
    transitionState: "",
    transitionClassNames: Object.assign(
      {},
      transitionStates,
      this.props.classNames
    )
  };

  timer;

  getClassName = transitionState => {
    const {
      beforeEnter,
      entering,
      beforeLeave,
      leaving
    } = this.state.transitionClassNames;

    switch (transitionState) {
      case transitionStates.beforeEnter:
        return beforeEnter;
      case transitionStates.entering:
        return cn(beforeEnter, entering);
      case transitionStates.beforeLeave:
        return beforeLeave;
      case transitionStates.leaving:
        return cn(beforeLeave, leaving);
      default:
        return "";
    }
  };

  animateIn = children => {
    const { beforeEnter, entering } = transitionStates;
    this.setState(
      {
        children,
        transitionState: beforeEnter
      },
      () => {
        setTimeout(() => {
          this.setState({ transitionState: entering }, () => {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.setState({ transitionState: "" });
            }, this.props.duration);
          });
        }, 16);
      }
    );
  };

  animateOut = children => {
    const { beforeLeave, leaving } = transitionStates;
    this.setState({ transitionState: beforeLeave }, () => {
      setTimeout(() => {
        this.setState({ transitionState: leaving }, () => {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.setState({
              children,
              transitionState: ""
            });
          }, this.props.duration);
        });
      }, 16);
    });
  };

  componentDidMount() {
    if (this.props.children) {
      this.animateIn(this.props.children);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentWillReceiveProps(nextProps) {
    const newChildren = Children.toArray(nextProps.children);
    const oldChildren = Children.toArray(this.props.children);

    if (newChildren.length !== oldChildren.length) {
      // Element was added or removed
      if (newChildren.length) {
        // Element is about to mount
        this.animateIn(nextProps.children);
      } else {
        // Element is about to unmount
        this.animateOut(nextProps.children);
      }
    } else {
      this.setState({
        children: nextProps.children
      });
    }
  }

  render() {
    const children = this.state.children;
    const childrenClass =
      (children && children.props && children.props.className) || "";

    return children
      ? React.cloneElement(children, {
          className: cn(
            childrenClass,
            this.getClassName(this.state.transitionState)
          )
        })
      : null;
  }
}

export default TinyTransitionWrapper;
