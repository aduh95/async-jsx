export type SynchroneAppendable = Node | string;
export type AsyncAppendable = Promise<SynchroneAppendable>;
export type CallableAppendable = (
  props: Object,
  ...children: (
    | AsyncAppendable
    | SynchroneAppendable
    | (AsyncAppendable | SynchroneAppendable)[])[]
) => SynchroneAppendable | AsyncAppendable;
export type Appendable =
  | SynchroneAppendable
  | AsyncAppendable
  | CallableAppendable;
export type ComponentChildren = AsyncAppendable | SynchroneAppendable;
export type ComponentChildrenArray = ComponentChildren | ComponentChildren[];

export interface StateCollection {
  [stateKey: number]: Appendable;
  [stateKey: string]: Appendable;
  // Symbol for state keys are not currently supported by Typescript sadely
  // Although it is perfectly valid JS, so you can ignore the TS error
  //   [stateKey: symbol]: Appendable;
}
