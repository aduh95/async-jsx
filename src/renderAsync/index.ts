import AsyncElement, { ASYNC_WRAPPER } from "./AsyncElement";
import ConditionalRendering, {
  CONDITIONAL_WRAPPER,
} from "./ConditionalRenderingElement";

customElements.define(ASYNC_WRAPPER, AsyncElement);
customElements.define(CONDITIONAL_WRAPPER, ConditionalRendering);

export { default as renderAsync } from "./renderAsync";
export { default as conditionalRendering } from "./conditionalRendering";
