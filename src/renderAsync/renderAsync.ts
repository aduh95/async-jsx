import AsyncElement, { ASYNC_WRAPPER } from "./AsyncElement";

import { AsyncAppendable, SynchroneAppendable } from "./StateCollection";

type FallbackCallback = (
  e: Error
) => AsyncAppendable | SynchroneAppendable | void;

/**
 * renderAsync(asyncElement[, placeholder][, onError])
 */
export default function renderAsync(
  asyncElement: AsyncAppendable,
  placeholder?: ChildNode | Promise<ChildNode> | FallbackCallback,
  onError?: FallbackCallback
) {
  const wrapper = document.createElement(ASYNC_WRAPPER) as AsyncElement;
  const { prototype } = AsyncElement;

  if (!placeholder) {
    // No placeholder, no op
  } else if ((placeholder as Promise<ChildNode>).then) {
    (placeholder as Promise<ChildNode>)
      .then(prototype.placeholder.bind(wrapper))
      .catch(console.warn);
  } else if ((placeholder as ChildNode).replaceWith) {
    wrapper.placeholder(placeholder as ChildNode);
  } else if ("function" === typeof placeholder) {
    onError = placeholder as FallbackCallback;
  } else {
    throw new TypeError("Unsuitable placeholder provided");
  }

  asyncElement
    .then(prototype.commit.bind(wrapper))
    .catch(onError)
    .then(prototype.commit.bind(wrapper))
    .catch(() => {
      wrapper.remove();
    });

  return wrapper;
}
