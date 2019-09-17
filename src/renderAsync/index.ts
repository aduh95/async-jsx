import AsyncElement, { ASYNC_WRAPPER } from "./AsyncElement.js";
import ConditionalRendering, {
  CONDITIONAL_WRAPPER,
} from "./ConditionalRenderingElement.js";

customElements.define(ASYNC_WRAPPER, AsyncElement);
customElements.define(CONDITIONAL_WRAPPER, ConditionalRendering);

export { default as renderAsync } from "./renderAsync.js";
export { default as conditionalRendering } from "./conditionalRendering.js";
