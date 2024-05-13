import CreateArtistForm from "@components/forms/artists/create-artist-form";
import UpdateArtistForm from "@components/forms/artists/update-artist-form";
import PageLoader from "@components/loaders/page-loader";
import useFetch from "@hooks/use-fetch";
import { getUserArtists } from "@services/artists";
import { useAuthStore } from "@stores/auth-store";

/**
 * Page for testing components in isolation.
 */
const SandboxPage = () => {
  function createArray<T>(object: T, length: number) {
    const arr = [];
    for (let i = 0; i < length; i++) {
      arr.push({ ...object });
    }

    return arr;
  }

  const user = useAuthStore((s) => s.user);
  const { data: artists } = useFetch(
    async (signal) => {
      return await getUserArtists(user?.id || "", signal);
    },
    [user]
  );

  if (!artists) {
    return <PageLoader />;
  }

  return (
    <>
      {/* <CreateReleaseForm artist={artists[0]} /> */}
      {/* <CreateArtistForm /> */}
      {artists && (
        <UpdateArtistForm
          artist={{ artistTypeSlug: artists[0].type.slug, ...artists[0] }}
        />
      )}

      {/* <Alert variant="info">
        <div>Hello</div>
      </Alert> */}
      {/* <AudioUploader onSubmit={() => {}} /> */}
    </>
  );
};

export default SandboxPage;
