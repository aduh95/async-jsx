import {
  AsyncAppendable,
  ComponentChildren,
  SynchroneAppendable,
} from "../renderAsync/StateCollection.js";

export interface Props {
  ref: { current: Node };
  style?:
    | string
    | {
        [propertyName: string]: string;
      };
  [key: string]: any;
}

export default class Component {
  protected props: Props;

  constructor(props: Props, children: ComponentChildren[]) {
    this.props = { ...props };
    Object.defineProperty(this.props, "children", {
      get: () => children,
      enumerable: false,
    });
  }

  render() {
    return Promise.reject(new Error("No render function defined")) as
      | AsyncAppendable
      | SynchroneAppendable;
  }

  _render() {
    return this.render();
  }
}
