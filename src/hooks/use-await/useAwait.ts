import { useState, useCallback, DependencyList } from "react";

// eslint-disable-next-line
function isError(value: any): value is Error {
  return (
    value &&
    value.stack &&
    value.message &&
    typeof value.stack === "string" &&
    typeof value.message === "string"
  );
}

export function useAwait<
  // eslint-disable-next-line
  TFunction extends ((...args: any[]) => Promise<any>) | (() => Promise<any>)
>(callback: TFunction, dependencies: DependencyList = []) {
  const [isLoading, setIsLoading] = useState(false);
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
          console.log(e);

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
