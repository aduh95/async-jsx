export const ASYNC_WRAPPER = "async-component";

export default class AsyncElement extends HTMLElement {
  private domElement: ChildNode;
  private settled = false;

  _setElement(element: ChildNode) {
    if (this.domElement) {
      this.domElement.replaceWith(element);
    } else {
      this.domElement = this.appendChild(element);
    }
  }

  placeholder(element: ChildNode) {
    if (this.settled) return;
    this.classList.add("loading");
    this._setElement(element);
  }

  commit(element: ChildNode) {
    if (this.settled) return;
    this.classList.remove("loading");
    if (this.domElement) {
      this.domElement.replaceWith(element);
    } else {
      this.append(element);
    }
    this.settled = true;
    this.domElement = null;
  }
}
