import Component from "./Component";

const STATEFUL_ELEMENT_NAME = "stateful-element";

class StatefulElement extends HTMLElement {
  private _previouslyDisconnected = true;
  private _unmountCallback = Function.prototype;
  private _mountCallback = Function.prototype;

  replaceCurrentElement(newElement: Node | string) {
    if (this.childElementCount) {
      this.firstChild.replaceWith(newElement);
    } else {
      this.append(newElement);
    }
  }

  observeElementLifecycle(onMount: Function, onUnmount: Function) {
    this._mountCallback = onMount;
    this._unmountCallback = onUnmount;
  }

  connectedCallback() {
    if (this._previouslyDisconnected && this.isConnected) {
      this._previouslyDisconnected = false;
      this._mountCallback(this);
    }
  }

  disconnectedCallback() {
    this._unmountCallback(this);
    this._previouslyDisconnected = true;
  }
}
customElements.define(STATEFUL_ELEMENT_NAME, StatefulElement);

/**
 * Somewhat compatible with React/preact Component API.
 * However, it is vastly less efficient because no virtual DOM is being used, which
 * means all the nodes from the render function have to be recreated at each render.
 */
export class StatefulComponent extends Component {
  private _domElement: StatefulElement;
  private _state = {};

  public placeholder?: Node | string;

  get state() {
    return Object.assign({}, this._state);
  }

  set state(newState) {
    Object.assign(this._state, newState);
  }

  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}

  forceUpdate() {
    Promise.resolve(this.render()).then(element =>
      this._domElement.replaceCurrentElement(element)
    );
    this.componentDidUpdate();
  }
  setState(newState: Object, callback = Function.prototype) {
    callback(Object.assign(this._state, newState));
    this.forceUpdate();
    if (this.placeholder && this._domElement.isConnected) {
      this._domElement.replaceCurrentElement(this.placeholder);
    }
  }

  _render() {
    this._domElement = document.createElement(
      STATEFUL_ELEMENT_NAME
    ) as StatefulElement;
    this._domElement.observeElementLifecycle(
      this.componentDidMount.bind(this),
      this.componentWillUnmount.bind(this)
    );
    this.forceUpdate();
    return this._domElement;
  }
}
