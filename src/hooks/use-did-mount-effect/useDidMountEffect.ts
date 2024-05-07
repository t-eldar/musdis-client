import { useFirstRender } from "@hooks/use-first-render";
import { DependencyList, EffectCallback, useEffect } from "react";

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
