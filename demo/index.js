import React from "react";
import { render } from "react-dom";

import CSSTransition from "../src";

class Main extends React.Component {
  state = {
    contentIsVisible: false
  };

  toggle = () => {
    this.setState(state => ({
      contentIsVisible: !state.contentIsVisible
    }));
  };

  render() {
    return (
      <div>
        <style>
          {`
            h1 {
              font-size: 80px;
              display: inline-block;
            }
            
            .before-enter {
              opacity: 0;
              transform: translateY(75px) scale(0.5);
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
        <button onClick={this.toggle}>Show content</button>

        <div>
          <CSSTransition duration={500}>
            {this.state.contentIsVisible && <h1 className="test">Hello!</h1>}
          </CSSTransition>
        </div>
      </div>
    );
  }
}

window.onload = function() {
  render(<Main />, document.getElementById("App"));
};
