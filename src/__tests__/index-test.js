/* eslint react/prefer-stateless-function: 0 */
/* eslint react/no-multi-comp: 0 */
jest.disableAutomock().useRealTimers();

const React = require("react");
const CSSTransition = require("..").default;
const TestUtils = require("react-dom/test-utils");

describe("ReactFlipMotion", () => {
  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
  });

  it("should not crash", () => {
    expect(() =>
      TestUtils.renderIntoDocument(
        <CSSTransition duration={500}>
          <div />
        </CSSTransition>
      )
    ).not.toThrow();
  });

  it("should render one child", () => {
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
          <CSSTransition duration={500}>
            <View style={{ height: 10, fontSize: 10 }}>{"foo"}</View>
          </CSSTransition>
        );
      }
    }

    const testComponent = TestUtils.renderIntoDocument(<TestComponent />);

    const reactCSSTransition = TestUtils.findRenderedComponentWithType(
      testComponent,
      CSSTransition
    );
    const elements = TestUtils.scryRenderedComponentsWithType(
      reactCSSTransition,
      View
    );
    expect(elements.length).toBe(1);
  });

  it("should return null on multiple children", () => {
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
          <CSSTransition duration={500}>
            <View style={{ height: 10, fontSize: 10 }}>{"foo"}</View>
            <View style={{ height: 10, fontSize: 10 }}>{"bar"}</View>
          </CSSTransition>
        );
      }
    }

    const testComponent = TestUtils.renderIntoDocument(<TestComponent />);

    const reactCSSTransition = TestUtils.findRenderedComponentWithType(
      testComponent,
      CSSTransition
    );
    const elements = TestUtils.scryRenderedComponentsWithType(
      reactCSSTransition,
      View
    );
    expect(elements.length).toBe(0);
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
          <CSSTransition duration={500}>
            {this.state.contentIsVisible && (
              <View style={{ height: 10, fontSize: 10 }}>{"foo"}</View>
            )}
          </CSSTransition>
        );
      }
    }

    const testComponent = TestUtils.renderIntoDocument(<TestComponent />);

    const reactCSSTransition = TestUtils.findRenderedComponentWithType(
      testComponent,
      CSSTransition
    );
    const elements = TestUtils.scryRenderedComponentsWithType(
      reactCSSTransition,
      View
    );
    expect(elements.length).toBe(0);

    testComponent.setState({
      contentIsVisible: true
    });

    return new Promise(done => {
      setTimeout(() => {
        const reactCSSTransition = TestUtils.findRenderedComponentWithType(
          testComponent,
          CSSTransition
        );
        const elements = TestUtils.scryRenderedComponentsWithType(
          reactCSSTransition,
          View
        );
        expect(elements.length).toBe(1);
        expect(elements[0].props.className).toBe("before-enter entering");
        done();
      }, 50);
    });
  });

  it("should delay unmounting", () => {
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
          <CSSTransition duration={500}>
            {this.state.contentIsVisible && (
              <View style={{ height: 10, fontSize: 10 }}>{"foo"}</View>
            )}
          </CSSTransition>
        );
      }
    }

    const testComponent = TestUtils.renderIntoDocument(<TestComponent />);

    testComponent.setState({
      contentIsVisible: false
    });

    return new Promise(done => {
      setTimeout(() => {
        const reactCSSTransition = TestUtils.findRenderedComponentWithType(
          testComponent,
          CSSTransition
        );
        const elements = TestUtils.scryRenderedComponentsWithType(
          reactCSSTransition,
          View
        );
        expect(reactCSSTransition.props.children).toBe(false);
        expect(elements.length).toBe(1);
        done();
      }, 400);
    });
  });
});
