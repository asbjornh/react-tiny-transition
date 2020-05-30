/* eslint-disable react/prop-types */
import React from "react";
import { render } from "react-dom";

import TinyTransition from "../src";

const TestComponent = ({ children }) => <h2 className="test">{children}</h2>;

class Main extends React.Component {
  state = {
    contentIsVisible: true,
  };

  toggle = () => {
    this.setState(state => ({
      contentIsVisible: !state.contentIsVisible,
    }));
  };

  render() {
    return (
      <div>
        <style>
          {`
            h2 {
              font-size: 80px;
              display: inline-block;
            }
            
            .before-enter {
              opacity: 0;
              transform: translateX(75px);
            }

            .entering {
              transition: transform 0.5s, opacity 0.5s;
              opacity: 1;
              transform: none;
            }

            .before-leave {
              transition: transform 0.5s, opacity 0.5s;
            }

            .leaving {
              opacity: 0;
              transform: translateY(50px);
            }
          `}
        </style>
        <button onClick={this.toggle}>Toggle content</button>

        <div>
          <TinyTransition>
            {this.state.contentIsVisible && <TestComponent>Tiny</TestComponent>}
          </TinyTransition>
          <TinyTransition delay={100}>
            {this.state.contentIsVisible && (
              <TestComponent>Transition</TestComponent>
            )}
          </TinyTransition>
        </div>
      </div>
    );
  }
}

window.onload = function () {
  render(<Main />, document.getElementById("App"));
};
