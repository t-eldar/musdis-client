import { DependencyList, EffectCallback, useEffect, useRef } from "react";

function useFirstRender() {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
}

/**
 * Call effects after the component is mounted.
 *
 * @param callback The callback effect function.
 * @param deps The dependency list.
 */
export function useDidMountEffect(
  callback: EffectCallback,
  deps: DependencyList
) {
  const firstRender = useFirstRender();

  useEffect(() => {
    if (!firstRender) {
      return callback();
    }
  }, deps); // eslint-disable-line
}

export default useDidMountEffect;
