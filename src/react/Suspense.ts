import renderAsync from "../renderAsync/renderAsync.js";
import Component from "./Component.js";
import {
  AsyncAppendable,
  SynchroneAppendable,
} from "../renderAsync/StateCollection.js";

interface SuspenseType {
  props: {
    children: Promise<Node | string | null>[];
    fallback: ChildNode | Promise<ChildNode>;
    onError: (e: Error) => AsyncAppendable | SynchroneAppendable | void;
  };
}

export default class Suspense extends Component {
  async render() {
    const { props } = (this as any) as SuspenseType;
    const subElements = props.children.splice(0);
    return renderAsync(
      Promise.all(subElements).then(children => {
        const frag = document.createDocumentFragment();
        frag.append(...children.filter(Boolean));
        return frag;
      }),
      await props.fallback,
      props.onError || console.error
    );
  }
}
