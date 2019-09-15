import AsyncElement, { ASYNC_WRAPPER } from "./AsyncElement";

import { AsyncAppendable, SynchroneAppendable } from "./StateCollection";

export default function renderAsync(
  asyncElement: AsyncAppendable,
  placeholder?: ChildNode | Promise<ChildNode>,
  fallback?: (e: Error) => AsyncAppendable | SynchroneAppendable | void
) {
  const wrapper = document.createElement(ASYNC_WRAPPER) as AsyncElement;
  const { prototype } = AsyncElement;

  if ((placeholder as Promise<ChildNode>).then) {
    (placeholder as Promise<ChildNode>)
      .then(prototype.placeholder.bind(wrapper))
      .catch(console.warn);
  } else if ((placeholder as ChildNode).replaceWith) {
    wrapper.placeholder(placeholder as ChildNode);
  }

  asyncElement
    .then(prototype.commit.bind(wrapper))
    .catch(fallback)
    .then(prototype.commit.bind(wrapper))
    .catch(() => {
      wrapper.remove();
    });

  return wrapper;
}
