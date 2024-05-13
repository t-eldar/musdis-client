import { CreateReleaseForm } from "@components/forms/releases/create-release-form";
import { PageLoader } from "@components/loaders/page-loader";
import useAlert from "@hooks/use-alert";
import { useFetch } from "@hooks/use-fetch";
import { getArtist } from "@services/artists";
import { useAuthStore } from "@stores/auth-store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreateReleasePage = () => {
  const params = useParams<{ artistIdOrSlug: string }>();
  const artistId = params.artistIdOrSlug;

  const alert = useAlert();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data: artist, isLoading: isArtistLoading } = useFetch(
    async (signal) => {
      return await getArtist(artistId || "", signal);
    }
  );

  useEffect(() => {
    if (user === null || (artist && user && artist.creatorId !== user.id)) {
      console.log(alert);

      alert({
        variant: "warning",
        title: "Unauthorized",
        message: "You do not have permission to access this page.",
      });

      navigate("/", { replace: true });
    }
  }, [user, artist, alert, navigate]);

  if (isArtistLoading || user === undefined) {
    return <PageLoader />;
  }

  return (
    <>
      {artist && (
        <CreateReleaseForm
          artist={artist}
          onCreated={() => navigate("/profile")}
        />
      )}
    </>
  );
};

export default CreateReleasePage;
