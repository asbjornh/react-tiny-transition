/* eslint react/prefer-stateless-function: 0 */
/* eslint react/no-multi-comp: 0 */
jest.disableAutomock().useRealTimers();

const React = require("react");
const ReactDOM = require("react-dom");
const TinyTransition = require("..").default;
const TestUtils = require("react-dom/test-utils");

global.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};

describe("TinyTransition", () => {
  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
  });

  it("should not crash", () => {
    expect(() =>
      TestUtils.renderIntoDocument(
        <TinyTransition duration={500}>
          <div />
        </TinyTransition>
      )
    ).not.toThrow();
  });

  it("should render children", () => {
    class View extends React.Component {
      render() {
        return <div {...this.props} />;
      }
    }

    class TestComponent extends React.Component {
      constructor(props) {
        super(props);
      }
      render() {
        return (
          <TinyTransition duration={500}>
            <View>{"foo"}</View>
            <View>{"bar"}</View>
          </TinyTransition>
        );
      }
    }

    const testComponent = TestUtils.renderIntoDocument(<TestComponent />);

    const reactTinyTransition = TestUtils.findRenderedComponentWithType(
      testComponent,
      TinyTransition
    );

    return new Promise(done => {
      setTimeout(() => {
        const elements = TestUtils.scryRenderedComponentsWithType(
          reactTinyTransition,
          View
        );

        expect(elements.length).toBe(2);
        done();
      }, 50);
    });
  });

  it("should apply classnames", () => {
    class View extends React.Component {
      render() {
        return <div {...this.props} />;
      }
    }

    class TestComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          contentIsVisible: false
        };
      }
      render() {
        return (
          <TinyTransition duration={500}>
            {this.state.contentIsVisible && <View>{"foo"}</View>}
          </TinyTransition>
        );
      }
    }

    const testComponent = TestUtils.renderIntoDocument(<TestComponent />);

    testComponent.setState({
      contentIsVisible: true
    });

    return new Promise(done => {
      setTimeout(() => {
        const node = ReactDOM.findDOMNode(testComponent);

        expect(!!node).toBe(true);
        expect(node.getAttribute("class")).toBe("before-enter entering");

        testComponent.setState({ contentIsVisible: false }, () => {
          setTimeout(() => {
            expect(node.getAttribute("class")).toBe("before-leave leaving");
            done();
          }, 100);
        });
      }, 100);
    });
  });

  it("should render custom classnames", () => {
    class View extends React.Component {
      render() {
        return <div {...this.props} />;
      }
    }

    class TestComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          contentIsVisible: false
        };
      }
      render() {
        return (
          <TinyTransition
            duration={500}
            classNames={{
              beforeEnter: "test1",
              entering: "test2",
              beforeLeave: "test3",
              leaving: "test4"
            }}
          >
            {this.state.contentIsVisible && <View>{"foo"}</View>}
          </TinyTransition>
        );
      }
    }

    const testComponent = TestUtils.renderIntoDocument(<TestComponent />);

    testComponent.setState({ contentIsVisible: true });

    return new Promise(done => {
      setTimeout(() => {
        const node = ReactDOM.findDOMNode(testComponent);

        expect(!!node).toBe(true);
        expect(node.getAttribute("class")).toBe("test1 test2");

        testComponent.setState({ contentIsVisible: false }, () => {
          setTimeout(() => {
            expect(node.getAttribute("class")).toBe("test3 test4");
            done();
          }, 25);
        });
      }, 25);
    });
  });

  it("should delay unmounting of children", () => {
    class View extends React.Component {
      render() {
        return <div {...this.props} />;
      }
    }

    class TestComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          contentIsVisible: true
        };
      }
      render() {
        return (
          <TinyTransition>
            {this.state.contentIsVisible && <View>{"foo"}</View>}
          </TinyTransition>
        );
      }
    }

    const testComponent = TestUtils.renderIntoDocument(<TestComponent />);
    const reactTinyTransition = TestUtils.findRenderedComponentWithType(
      testComponent,
      TinyTransition
    );

    return new Promise(done => {
      // Need to delay hiding because the first render returns null. Hiding children before they have been rendered means there are no children to hide
      setTimeout(() => {
        testComponent.setState({
          contentIsVisible: false
        });

        setTimeout(() => {
          const node = ReactDOM.findDOMNode(testComponent);
          expect(reactTinyTransition.props.children).toBe(false);
          expect(!!node).toBe(true);
          done();
        }, 400);
      }, 100);
    });
  });
});
