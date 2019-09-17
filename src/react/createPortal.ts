import {
  Appendable,
  ComponentChildren,
  SynchroneAppendable,
} from "../renderAsync/StateCollection.js";

const PORTAL_ELEMENT_NAME = "dom-portal";

class PortalElement extends HTMLElement {
  private _domElement: Element;
  private _parent: Element;

  attach(element: Element, parent: Element) {
    this._domElement = parent.appendChild(element);
    this._domElement.append(...((this.children as unknown) as HTMLElement[]));
    this._parent = parent;
  }

  append(...children: SynchroneAppendable[]) {
    return this._domElement
      ? this._domElement.append(...children)
      : super.append(...children);
  }
  appendChild<T extends Node>(newChild: T): T {
    return this._domElement
      ? this._domElement.appendChild(newChild)
      : super.appendChild(newChild);
  }

  connectedCallback() {
    if (this._parent && this._domElement && this.isConnected) {
      this._parent.append(this._domElement);
    }
  }

  disconnectedCallback() {
    if (this._domElement && this._domElement.isConnected) {
      this._domElement.remove();
    }
  }
}

customElements.define(PORTAL_ELEMENT_NAME, PortalElement);

export default function createPortal(
  asyncElement: Element | Promise<Element>,
  parent: Element,
  callback: FrameRequestCallback = null
) {
  const portal = document.createElement(PORTAL_ELEMENT_NAME) as PortalElement;

  Promise.resolve(asyncElement).then(element => {
    portal.attach(element, parent);
    if ("function" === typeof callback) {
      requestAnimationFrame(callback);
    }
  });

  return portal;
}
