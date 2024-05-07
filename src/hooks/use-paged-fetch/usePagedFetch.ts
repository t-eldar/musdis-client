import { DependencyList, useCallback, useEffect, useState } from "react";
import { useAwait } from "@hooks/use-await";
import { PagedDataResponse } from "@app-types/responses";

export default function usePagedFetch<
  TFetch extends (
    page: number,
    pageSize: number,
    abortSignal: AbortSignal
  ) => Promise<PagedDataResponse<any>> //eslint-disable-line
>(
  fetch: TFetch,
  pageNumber: number,
  pageSize = 20,
  appendData = false,
  dependencies: DependencyList = []
) {
  const [data, setData] = useState<Awaited<ReturnType<TFetch>>["data"]>();
  const [hasMore, setHasMore] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);

  const fetcher = useCallback(
    async (abortSignal: AbortSignal, page: number) => {
      const result = await fetch(page, pageSize, abortSignal);
      setData((prevData) => {
        if (appendData && prevData) {
          const map = new Map<string, string>();
          for (const obj of prevData.concat(result.data)) {
            map.set(obj.id, obj);
          }

          return Array.from(map.values()) as Awaited<
            ReturnType<TFetch>
          >["data"];
        }
        return [...result.data] as Awaited<ReturnType<TFetch>>["data"];
      });

      setHasMore(result.paginationInfo.hasNext);
    },
    [fetch, pageSize, appendData]
  );

  const { promise, isLoading, error } = useAwait(fetcher, [
    isCleaned,
    ...dependencies,
  ]);

  useEffect(() => {
    const abortController = new AbortController();
    promise(abortController.signal, pageNumber);

    return () => {
      abortController.abort();
      setIsCleaned(true);
    };
  }, [pageNumber, promise]);

  return {
    isLoading,
    error,
    data,
    hasMore,
    refresh: () => {
      setData([] as Awaited<ReturnType<TFetch>>["data"]);
    },
    refetch: async () => {
      const abortController = new AbortController();
      return await fetcher(abortController.signal, pageNumber);
    },
  };
}
