/* eslint react/prefer-stateless-function: 0 */
/* eslint react/no-multi-comp: 0 */
jest.disableAutomock().useRealTimers();

const React = require("react");
const TinyTransition = require("..").default;
const TestUtils = require("react-dom/test-utils");

describe("ReactFlipMotion", () => {
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
            <View style={{ height: 10, fontSize: 10 }}>{"foo"}</View>
            <View style={{ height: 10, fontSize: 10 }}>{"bar"}</View>
          </TinyTransition>
        );
      }
    }

    const testComponent = TestUtils.renderIntoDocument(<TestComponent />);

    const reactTinyTransition = TestUtils.findRenderedComponentWithType(
      testComponent,
      TinyTransition
    );
    const elements = TestUtils.scryRenderedComponentsWithType(
      reactTinyTransition,
      View
    );
    expect(elements.length).toBe(2);
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
            {this.state.contentIsVisible && (
              <View style={{ height: 10, fontSize: 10 }}>{"foo"}</View>
            )}
          </TinyTransition>
        );
      }
    }

    const testComponent = TestUtils.renderIntoDocument(<TestComponent />);

    const reactTinyTransition = TestUtils.findRenderedComponentWithType(
      testComponent,
      TinyTransition
    );
    const elements = TestUtils.scryRenderedComponentsWithType(
      reactTinyTransition,
      View
    );
    expect(elements.length).toBe(0);

    testComponent.setState({
      contentIsVisible: true
    });

    return new Promise(done => {
      setTimeout(() => {
        const reactTinyTransition = TestUtils.findRenderedComponentWithType(
          testComponent,
          TinyTransition
        );
        const elements = TestUtils.scryRenderedComponentsWithType(
          reactTinyTransition,
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
          <TinyTransition duration={500}>
            {this.state.contentIsVisible && (
              <View style={{ height: 10, fontSize: 10 }}>{"foo"}</View>
            )}
          </TinyTransition>
        );
      }
    }

    const testComponent = TestUtils.renderIntoDocument(<TestComponent />);

    testComponent.setState({
      contentIsVisible: false
    });

    return new Promise(done => {
      setTimeout(() => {
        const reactTinyTransition = TestUtils.findRenderedComponentWithType(
          testComponent,
          TinyTransition
        );
        const elements = TestUtils.scryRenderedComponentsWithType(
          reactTinyTransition,
          View
        );
        expect(reactTinyTransition.props.children).toBe(false);
        expect(elements.length).toBe(1);
        done();
      }, 400);
    });
  });
});
