export default class ReplacableDocumentFragment extends DocumentFragment {
  private _children: ChildNode[] = [];

  static from(frag: DocumentFragment) {
    const newFrag = new this();
    if (frag.childElementCount) {
      newFrag._children = Array.from(frag.children);
      newFrag.append(frag);
    } else {
      const comment = document.createComment("empty fragment");
      newFrag._children = [comment];
      newFrag.append(comment);
    }
    return newFrag;
  }

  before(...elements: (Node | string)[]) {
    this._children[0].before(...elements);
  }
  after(...elements: (Node | string)[]) {
    this._children[this._children.length - 1].after(...elements);
  }

  private replaceWithDocumentFragment(element: DocumentFragment) {
    const { length } = this._children;
    const { childElementCount, children } = element as DocumentFragment;
    const newElements = Array.from(children);

    if (length > childElementCount) {
      this._children.splice(childElementCount).forEach(el => el.remove());
    }
    this._children.forEach((oldElement, i, a) => {
      oldElement.replaceWith((a[i] = newElements[i]));
    });

    for (let i = length; i < childElementCount; i++) {
      this._children.push(newElements[i]);
      newElements[length].after(newElements[i]);
    }
  }

  replaceWithSingleElement(element: Node) {
    this._children.pop().replaceWith(element);
    this._children.forEach(el => el.remove());
    this._children = [element as ChildNode];
  }

  replaceWith(...elements: (Node | string)[]) {
    for (const element of elements) {
      if ((element as Node).nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        this.replaceWithDocumentFragment(element as DocumentFragment);
      } else if (this._children.length) {
        this.replaceWithSingleElement(
          "string" === typeof element
            ? document.createTextNode(element)
            : element
        );
      } else {
        throw new Error("Cannot replace empty fragment");
      }
    }
  }

  remove() {
    this._children.forEach(el => el.remove());
    this._children = null;
  }
}
