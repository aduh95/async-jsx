import AsyncElement from "./AsyncElement";
import ReplacableDocumentFragment from "./ReplacableDocumentFragment";
import { StateCollection, Appendable } from "./StateCollection";

export const CONDITIONAL_WRAPPER = "conditional-element";

export default class ConditionalRenderingElement extends AsyncElement {
  private states: StateCollection = {};
  private currentState: any;

  private __setElement = this._setElement.bind(this);

  async _setElement(element: Appendable) {
    switch (typeof element) {
      case "undefined":
        break;

      case "string":
        super._setElement(document.createTextNode(element));
        break;

      case "function":
        await Promise.resolve(element.call(this)).then(this.__setElement);
        break;

      default:
        if ((element as Node).nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          super._setElement(
            ReplacableDocumentFragment.from(element as DocumentFragment)
          );
        } else if ((element as Node).nodeType > 0) {
          super._setElement(element as ChildNode);
        } else {
          await Promise.resolve(element).then(this.__setElement);
        }
    }
  }

  defineStates(states: StateCollection) {
    return Object.assign(this.states, states);
  }

  setState(state: number | string) {
    if (state !== this.currentState) {
      this.currentState = state;
      return this._setElement(this.states[state]);
    }
  }
}
