import h from "./createElement.js";
import { Props } from "./Component.js";
import {
  ComponentChildren,
  Appendable,
} from "../renderAsync/StateCollection.js";

interface AppendableModule {
  default: Appendable | Promise<Appendable>;
}

type importAppendable = () => Promise<AppendableModule>;

export default function lazy(importCallback: importAppendable) {
  return (
    props: Props,
    ...children: (ComponentChildren | ComponentChildren[])[]
  ) =>
    importCallback()
      .then(module => module.default)
      .then(El => h(El, props, children as ComponentChildren[]));
}
