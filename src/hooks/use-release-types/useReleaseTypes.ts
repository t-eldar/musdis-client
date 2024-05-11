import { useFetch } from "@hooks/use-fetch";
import { getReleaseTypes } from "@services/release-types";

export default function useReleaseTypes() {
  const { data, isLoading, error } = useFetch(async (signal) => {
    return await getReleaseTypes(signal);
  });

  return { releaseTypes: data, isLoading, error };
}
