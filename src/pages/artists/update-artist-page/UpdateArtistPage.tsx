import styles from "./UpdateArtistPage.module.css";

import { UpdateArtistForm } from "@components/forms/artists/update-artist-form";
import { PageLoader } from "@components/loaders/page-loader";
import { useAlert } from "@hooks/use-alert";
import { useFetch } from "@hooks/use-fetch";
import { getArtist } from "@services/artists";
import { useAuthStore } from "@stores/auth-store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateArtistPage = () => {
  const params = useParams<{ artistIdOrSlug: string }>();
  const artistId = params.artistIdOrSlug;

  const user = useAuthStore((s) => s.user);
  const { data: artist } = useFetch(
    async (signal) => {
      return await getArtist(artistId || "", signal);
    },
    [artistId]
  );

  const navigate = useNavigate();
  const alert = useAlert();

  useEffect(() => {
    if (user === null || (artist && user && artist.creatorId !== user.id)) {
      alert({
        variant: "warning",
        title: "Unauthorized",
        message: "You do not have permission to access this page.",
      });

      navigate("/", { replace: true });
    }
  }, [user, artist, alert, navigate]);

  if (user === null) {
    return <PageLoader />;
  }

  return (
    <div className={styles.container}>
      {artist && (
        <UpdateArtistForm
          onDeleted={() => navigate("/profile", { replace: true })}
          className={styles.form}
          artist={{ artistTypeSlug: artist.type.slug, ...artist }}
        />
      )}
    </div>
  );
};

export default UpdateArtistPage;
