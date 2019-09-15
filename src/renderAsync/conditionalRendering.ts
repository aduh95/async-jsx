import ConditionalRenderingElement, {
  CONDITIONAL_WRAPPER,
} from "./ConditionalRenderingElement";

import { StateCollection } from "./StateCollection";

export default function conditionalRendering(
  states: StateCollection,
  setOfObservers: Set<(state: string | number) => Promise<void>>,
  initialState: string | number,
  // @ts-ignore
  onError?: (e: Error) => void = Function.prototype
) {
  const wrapper = document.createElement(
    CONDITIONAL_WRAPPER
  ) as ConditionalRenderingElement;

  wrapper.defineStates(states);
  if (initialState !== undefined) {
    wrapper.setState(initialState);
  }

  if (setOfObservers) {
    setOfObservers.add((state: string | number) =>
      wrapper.setState(state).catch(onError)
    );
  }

  return wrapper;
}
