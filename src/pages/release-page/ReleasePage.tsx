import { useFetch } from "@hooks/use-fetch";
import { getRelease } from "@services/releases";
import { useParams } from "react-router-dom";

const ReleasePage = () => {
  const params = useParams<{ releaseSlug: string }>();
  const slug = params.releaseSlug || "";

  const {
    data: release,
    isLoading: isReleaseLoading,
    error: releaseError,
  } = useFetch(async (abortSignal) => {
    return await getRelease(slug, abortSignal);
  });

  return <>
  
  </>;
};

export default ReleasePage;
