import styles from "./ReleasePage.module.css";

import { ArtistsLinks } from "@components/artists-links";
import { TrackList } from "@components/lists/track-list";
import PageLoader from "@components/loaders/page-loader";
import { Button } from "@components/ui/button";
import useCanEdit from "@hooks/use-can-edit";
import { useFetch } from "@hooks/use-fetch";
import { getRelease } from "@services/releases";
import { useAudioStore } from "@stores/audio-store";
import { useAuthStore } from "@stores/auth-store";
import { isCancelledError } from "@utils/assertions";
import { formatDate, formatSeconds } from "@utils/time-utils";
import { CSSProperties, useEffect, useState } from "react";
import { TbClock, TbList, TbPencil, TbPlayerPlayFilled } from "react-icons/tb";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const ReleasePage = () => {
  const params = useParams<{ releaseSlug: string }>();
  const slug = params.releaseSlug || "";

  const audioElement = useAudioStore((state) => state.audioElement);
  const setPlaylist = useAudioStore((state) => state.setPlaylist);
  const setCurrentTrackId = useAudioStore((state) => state.setCurrentTrackId);

  const [totalDuration, setTotalDuration] = useState(0);

  const navigate = useNavigate();

  const {
    data: release,
    isLoading: isReleaseLoading,
    error: releaseError,
  } = useFetch(async (abortSignal) => {
    return await getRelease(slug, abortSignal);
  });

  const canEdit = useCanEdit(release);

  if (isReleaseLoading) {
    return <PageLoader />;
  }

  if (
    (!release && isReleaseLoading === false) ||
    (releaseError && !isCancelledError(releaseError))
  ) {
    return <Navigate to={"/not-found"} />;
  }
  if (!release) {
    return <></>;
  }

  function handlePlay() {
    console.log(audioElement, release);

    if (release) {
      setPlaylist(release.tracks);
      setCurrentTrackId(release.tracks[0].id);
    }
  }

  function handleEditRelease() {
    navigate(`update`);
  }

  return (
    <div
      className={styles.container}
      style={{ "--bg-image": `url(${release?.coverUrl})` } as CSSProperties}
    >
      <div className={styles["header-container"]}>
        <div className={styles["cover-container"]}>
          {<img src={release?.coverUrl} className={styles.cover} />}
        </div>

        <div className={styles["info-container"]}>
          <div>
            <h1 className={styles.title}>{release?.name}</h1>
            <ArtistsLinks
              artists={release?.artists}
              className={styles.artists}
            />
            <span className={styles["release-date"]}>
              {formatDate(release.releaseDate)}
            </span>
          </div>
          <div className={styles["header-bottom"]}>
            <Button className={styles["play-button"]} onClick={handlePlay}>
              <TbPlayerPlayFilled style={{ marginRight: "0.5rem" }} />
              Play all
            </Button>
            {canEdit && (
              <Button
                className={styles["edit-button"]}
                onClick={handleEditRelease}
              >
                <TbPencil /> Edit
              </Button>
            )}
            <div className={styles["tracks-info"]}>
              <div className={styles["info"]}>
                <TbList />
                {release?.tracks.length}
              </div>
              <div className={styles["info"]}>
                <TbClock />
                {formatSeconds(totalDuration)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["track-container"]}>
        <TrackList
          tracks={release?.tracks}
          onTotalDurationChange={setTotalDuration}
        />
      </div>
    </div>
  );
};

export default ReleasePage;
