import Loader from "@components/loaders/loader";
import styles from "./ArtistPage.module.css";

import { ReleaseList } from "@components/lists/release-list";
import PageLoader from "@components/loaders/page-loader";
import { useFetch } from "@hooks/use-fetch";
import { getArtist, getUsedReleaseTypes } from "@services/artists";
import { getArtistReleases } from "@services/releases";
import { getUser } from "@services/users";
import { isCancelledError } from "@utils/assertions";
import { combineClassNames } from "@utils/style-utils";
import { CSSProperties, useEffect, useState } from "react";
import { TbList, TbMusicPlus, TbPencil, TbUser, TbUsers } from "react-icons/tb";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import * as Avatar from "@radix-ui/react-avatar";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@components/ui/button";
import { useAuthStore } from "@stores/auth-store";

const ArtistPage = () => {
  const { data: releaseTypes, isLoading: isReleaseTypesLoading } = useFetch(
    async (signal) => {
      return await getUsedReleaseTypes(artistIdOrSlug, signal);
    }
  );

  const params = useParams<{ artistIdOrSlug: string }>();
  const artistIdOrSlug = params.artistIdOrSlug || "";

  const user = useAuthStore((s) => s.user);

  const navigate = useNavigate();

  const [releasesInfo, setReleasesInfo] = useState<Record<string, number>>();

  const [isCreator, setIsCreator] = useState(false);

  const [type, setType] = useState({
    name: "Latest releases",
    slug: "",
  });

  const {
    data: artist,
    isLoading: isArtistLoading,
    error: artistError,
  } = useFetch(async (signal) => {
    return await getArtist(artistIdOrSlug, signal);
  });

  const { data: creator } = useFetch(
    async (signal) => {
      return await getUser(artist?.creatorId || "", signal);
    },
    [artist]
  );

  const {
    data: releases,
    error: releasesError,
    isLoading: isReleasesLoading,
    // error,
  } = useFetch(
    async (signal) => {
      return await getArtistReleases(artistIdOrSlug, type.slug, signal);
    },
    [type]
  );

  useEffect(() => {
    setIsCreator(!!user && !!artist && user.id === artist.creatorId);
  }, [user, artist]);

  useEffect(() => {
    if (!releasesInfo?.[type.slug]) {
      setReleasesInfo((prev) => {
        return {
          ...prev,
          [type.slug]: releases?.length || 0,
        };
      });
    }
  }, [releases, type]); //eslint-disable-line

  function handleCreateReleaseClick() {
    if (!artist) {
      return;
    }
    navigate(`create-release`);
  }

  function handleEditArtist() {
    if (!artist) {
      return;
    }
    navigate(`update-artist`);
  }

  if (
    (!artist && isArtistLoading) ||
    (!artist && isCancelledError(artistError))
  ) {
    return <PageLoader />;
  }

  if (
    (!artist && isArtistLoading === false) ||
    (artistError && !isCancelledError(artistError))
  ) {
    console.log(artist, isArtistLoading);

    return <Navigate to={"/not-found"} />;
  }

  if (!artist) {
    return;
  }

  return (
    <>
      <div
        className={styles.background}
        style={
          {
            "--bg-image": `url(${artist.coverUrl})`,
          } as CSSProperties
        }
      >
        <div className={styles["info-container"]}>
          <h1 className={styles.title}>{artist.name}</h1>
          <div>
            {artist.type.slug === "band" ? (
              <div className={styles.info}>
                Band <TbUsers />
              </div>
            ) : (
              <div className={styles.info}>
                Musician <TbUser />
              </div>
            )}
            <div className={styles.info}>
              <TbList />
              {releasesInfo?.[""]}
            </div>
          </div>
          <div className={styles["user-wrapper"]}>
            <span className={styles["created-by"]}>Created by: </span>
            <div className={styles["info-wrapper"]}>
              <Avatar.Root className={styles["avatar-root"]}>
                <Avatar.Image
                  className={styles["avatar-image"]}
                  src={creator?.avatarUrl || ""}
                />
                <Avatar.Fallback
                  className={styles["avatar-fallback"]}
                  delayMs={600}
                >
                  {creator?.userName.charAt(0).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className={styles.username}>{creator?.userName}</div>
            </div>
          </div>
        </div>
      </div>

      {isCreator && (
        <div className={styles["creator-button-container"]}>
          <Button onClick={handleCreateReleaseClick}>
            <TbMusicPlus /> Create release
          </Button>
          <Button onClick={handleEditArtist}>
            <TbPencil /> Edit artist
          </Button>
        </div>
      )}
      <div className={styles["tabs-container"]}>
        {releases?.length === 0 ? (
          <h1 className={styles.title}>No releases yet</h1>
        ) : (
          <Tabs.Root defaultValue="releases">
            <Tabs.List
              className={styles["tabs-list"]}
              aria-label="Choose release type"
            >
              <Tabs.Trigger
                defaultChecked
                className={styles["tabs-trigger"]}
                value="releases"
                onClick={() =>
                  setType({
                    name: "Latest release",
                    slug: "",
                  })
                }
              >
                Latest releases
              </Tabs.Trigger>
              {isReleaseTypesLoading ? (
                <Tabs.Trigger
                  className={combineClassNames(
                    styles["tabs-trigger"],
                    styles["disabled"]
                  )}
                  value={"releases"}
                >
                  <Loader size={20} />
                </Tabs.Trigger>
              ) : (
                releaseTypes?.map((rt) => (
                  <Tabs.Trigger
                    className={styles["tabs-trigger"]}
                    key={rt.id}
                    value={"releases"}
                    onClick={() => setType(rt)}
                  >
                    {rt.name}s
                  </Tabs.Trigger>
                ))
              )}
            </Tabs.List>
            <Tabs.Content value="releases">
              {isReleasesLoading ? (
                <Loader className={styles.loader} />
              ) : releasesError && !isCancelledError(releasesError) ? (
                <h1 className={styles.title}>Artist has no releases yet</h1>
              ) : (
                <div>
                  <h1 className={styles.title}>{type.name}s</h1>
                  <ReleaseList releases={releases || []} />
                </div>
              )}
            </Tabs.Content>
          </Tabs.Root>
        )}
      </div>
    </>
  );
};

export default ArtistPage;
