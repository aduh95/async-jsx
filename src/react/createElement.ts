import { refMap } from "./createRef";
import Component, { Props } from "./Component";
import { Appendable, ComponentChildren } from "../renderAsync/StateCollection";
const EVENT_PROP = /^on[A-Z]/;

export default async function h(
  element: Appendable | Component,
  props: Props = null,
  ...children: (ComponentChildren | ComponentChildren[])[]
) {
  switch (typeof element) {
    case "function":
      if (element.prototype && element.prototype.constructor === element) {
        //@ts-ignore
        const component = new element(props, children) as Component;
        if ("function" !== typeof component._render) debugger;
        element = await component._render();
      } else {
        element = await element(props, children as ComponentChildren[]);
      }
      break;

    case "string":
      element = document.createElement(element);

      if (props) {
        if (props.ref) {
          refMap.set(props.ref, element);
          props.ref = undefined;
        }
        Object.entries(props)
          .filter(([name, value]) => value !== undefined)
          .forEach(([name, value]) =>
            EVENT_PROP.test(name)
              ? ((element as any)[name.toLowerCase()] = value)
              : name in (element as Element)
              ? ((element as any)[name] = value)
              : (element as Element).setAttribute(name, value)
          );
      }
      break;

    default:
      element = "render" in element ? await element.render() : await element;
  }

  if (children.length && (element as Element).append) {
    const subElements: Node[] = await Promise.all(children.flat(Infinity));
    (element as Element).append(...subElements.filter(Boolean));
  }
  return element;
}
