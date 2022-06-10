import { isNormalEqual } from "../tool.js";
import { MyReactInternalInstance } from "../share.js";

class MyReactComponent extends MyReactInternalInstance {
  state;

  props;

  context;

  __isForce__ = false;

  __prevProps__ = null;

  __nextProps__ = null;

  __prevContext__ = null;

  __nextContext__ = null;

  __prevState__ = null;

  __nextState__ = null;

  __pendingEffect__ = false;

  __pendingCallback__ = [];

  constructor(props, context) {
    super();
    this.props = props;
    this.context = context;
  }

  get isMyReactComponent() {
    return true;
  }

  setState = (newValue, callback) => {
    let newState = newValue;

    if (typeof newValue === "function") {
      newState = newValue(this.state, this.props);
    }

    this.__nextState__ = Object.assign({}, this.__nextState__, newState);

    callback && this.__pendingCallback__.push(callback);

    Promise.resolve().then(() => this.__fiber__.update());
  }

  forceUpdate = () => {
    this.__isForce__ = true;
    Promise.resolve().then(() => this.__fiber__.update());
  }

  updateInstance(newState, newProps, newContext) {
    if (newProps) {
      this.__prevProps__ = this.props;
      this.props = newProps;
    }
    if (newState) {
      this.__prevState__ = this.state;
      this.state = newState;
    }
    if (newContext) {
      this.__prevContext__ = this.context;
      this.context = newContext;
    }
    this.__fiber__.memoProps = this.props;
    this.__fiber__.memoState = this.state;
  }

  resetPrevInstanceState() {
    this.__prevState__ = null;
    this.__prevProps__ = null;
    this.__prevContext__ = null;
  }

  resetNextInstanceState() {
    this.__nextProps__ = null;
    this.__nextState__ = null;
    this.__nextContext__ = null;
  }
}

class MyReactPureComponent extends MyReactComponent {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      !isNormalEqual(this.props, nextProps) ||
      !isNormalEqual(this.state, nextState) ||
      !isNormalEqual(this.context, nextContext)
    );
  }
}

export { MyReactComponent, MyReactPureComponent };
