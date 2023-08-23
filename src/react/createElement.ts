import { refMap } from "./createRef.js";
import Component, { Props } from "./Component.js";
import type {
  Appendable,
  ComponentChildren,
  SynchroneAppendable,
} from "../renderAsync/StateCollection.js";
const EVENT_PROP = /^on[A-Z]/;

export default async function h(
  element: Appendable | Component,
  props: Props = null,
  ...children: (ComponentChildren | ComponentChildren[])[]
) {
  switch (typeof element) {
    case "function":
      if (
        element.prototype &&
        "function" === typeof element.prototype._render
      ) {
        const component = new (element as any as {
          new (
            props: Props,
            children: (ComponentChildren | ComponentChildren[])[]
          ): Component;
        })(props, children) as Component;
        element = await component._render();
      } else {
        element = await element(props, children as ComponentChildren[]);
      }
      break;

    case "string":
      element = document.createElement(element, {
        is: props == null ? undefined : props.is,
      });

      if (props) {
        if (props.ref) {
          refMap.set(props.ref, element);
          props.ref = undefined;
        }
        if ("object" === typeof props.style) {
          Object.entries(props.style).forEach(([propertyName, value]) =>
            (element as HTMLElement).style.setProperty(propertyName, value)
          );
          props.style = undefined;
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
      if (children.length && (element as Element).append) {
        const subElements = await Promise.all(
          children.flat(Infinity) as Promise<SynchroneAppendable>[]
        );
        (element as Element).append(...subElements.filter(Boolean));
      }
      break;

    default:
      element = "_render" in element ? await element._render() : await element;
  }

  return element;
}
