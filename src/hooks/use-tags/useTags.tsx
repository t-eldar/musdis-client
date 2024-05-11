import { useFetch } from "@hooks/use-fetch";
import { getTags } from "@services/tags";

export default function useTags() {
  const { data, isLoading, error } = useFetch(async (signal) => {
    return await getTags(signal);
  });

  return { tags: data, isLoading, error };
}
