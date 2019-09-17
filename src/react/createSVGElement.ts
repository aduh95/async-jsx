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
    if ("object" === typeof props.style) {
      Object.entries(props.style as ({
        [propertyName: string]: string;
      })).forEach(([propertyName, value]) =>
        domElement.style.setProperty(propertyName, value)
      );
      props.style = undefined;
    }
    if (props.className) {
      // className is read-only on SVGElement
      // @see https://svgwg.org/svg2-draft/types.html#InterfaceSVGElement
      domElement.setAttribute("class", props.className);
      props.className = undefined;
    }
    Object.entries(props)
      .filter(([name, value]) => value !== undefined)
      .forEach(([name, value]) => domElement.setAttribute(name, value));
  }

  if (children.length) {
    const subElements: Node[] = await Promise.all(children.flat(Infinity));
    domElement.append(...subElements.filter(Boolean));
  }

  return domElement;
}
