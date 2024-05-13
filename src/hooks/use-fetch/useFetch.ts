import { useEffect, useState, useCallback, DependencyList } from "react";
import { useAwait } from "@hooks/use-await";

export default function useFetch<
  TFetch extends (abortSignal: AbortSignal) => Promise<unknown>
>(
  fetch: TFetch,
  dependencies: DependencyList = []
): {
  data: Awaited<ReturnType<typeof fetch>> | undefined;
  isLoading: boolean | undefined;
  error: Error | undefined;
  refetch: () => Promise<Awaited<ReturnType<TFetch>> | undefined>;
} {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetch>>>();
  const [isCleaned, setIsCleaned] = useState(false);
  const { promise, isLoading, error } = useAwait<TFetch>(fetch, [
    isCleaned,
    ...dependencies,
  ]);

  const abortController = new AbortController();

  const fetcher = useCallback(async (): Promise<
    Awaited<ReturnType<TFetch>> | undefined
  > => {
    const result = await promise(
      ...([abortController.signal] as Parameters<TFetch>)
    );
    setData(result);

    return result;
  }, [promise]); // eslint-disable-line

  useEffect(() => {
    fetcher();
    return () => {
      setIsCleaned(true);
      abortController.abort();
    };
  }, [fetcher]); // eslint-disable-line

  return {
    data,
    isLoading,
    error,
    refetch: fetcher,
  };
}
