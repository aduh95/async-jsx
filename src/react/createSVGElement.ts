import { refMap } from "./createRef.js";
import { Props } from "./Component.js";
import { ComponentChildren } from "../renderAsync/StateCollection.js";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export default async function h(
  element: string,
  props: Props = null,
  ...children: (ComponentChildren | ComponentChildren[])[]
) {
  const domElement = document.createElementNS(SVG_NAMESPACE, element);

  if (props) {
    if (props.ref) {
      refMap.set(props.ref, element);
      props.ref = undefined;
    }
    Object.entries(props)
      .filter(([name, value]) => value !== undefined)
      .forEach(([name, value]) => domElement.setAttribute(name, value));
  }

  if (children.length) {
    const subElements: Node[] = await Promise.all(children.flat(Infinity));
    domElement.append(...subElements.filter(Boolean));
  }

  return element;
}
