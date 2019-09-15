import {
  AsyncAppendable,
  ComponentChildren,
  SynchroneAppendable,
} from "../renderAsync/StateCollection";

export interface Props {
  ref: { current: Node };
  [key: string]: any;
}

export default class Component {
  protected props: Props;

  constructor(props: Props, children: ComponentChildren[]) {
    this.props = { children, ...props };
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
