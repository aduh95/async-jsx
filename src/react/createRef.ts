export const refMap = new WeakMap();

export default function createRef() {
  return {
    get current() {
      return refMap.get(this);
    },
  };
}
