import { isError } from "@utils/assertions";
import { useState, useCallback, DependencyList } from "react";

export function useAwait<
  // eslint-disable-next-line
  TFunction extends ((...args: any[]) => Promise<any>) | (() => Promise<any>)
>(callback: TFunction, dependencies: DependencyList = []) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  const promise = useCallback<
    (
      ...args: Parameters<TFunction>
    ) => Promise<Awaited<ReturnType<TFunction>> | undefined>
  >(
    async (
      ...args: Parameters<TFunction>
    ): Promise<Awaited<ReturnType<TFunction>> | undefined> => {
      try {
        setError(undefined);
        setIsLoading(true);

        return await callback(...args);
      } catch (e) {
        if (isError(e)) {
          setError(e);
        } else {
          setError(new Error("Some error occurred"));
        }
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line
    [...dependencies]
  );
  return { promise, isLoading, error };
}
