import TrackList from "@components/lists/track-list";
import styles from "./HomePage.module.css";

import ArtistsLinks from "@components/artists-links";
import ReleaseList from "@components/lists/release-list";
import Button from "@components/ui/button";
import { useFetch } from "@hooks/use-fetch";
import { getLatestReleases, getRandomRelease } from "@services/releases";
import { formatDate, formatSeconds } from "@utils/time-utils";
import { useState } from "react";
import {
  TbClock,
  TbList,
  TbPlayerPlay,
  TbPlayerPlayFilled,
} from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import Separator from "@components/ui/separator";
import Footer from "@components/footer";

const HomePage = () => {
  const [totalDuration, setTotalDuration] = useState(0);

  const navigate = useNavigate();

  const { data: release } = useFetch(async (signal) => {
    return await getRandomRelease(signal);
  });

  const { data: releases } = useFetch(async (signal) => {
    return await getLatestReleases(1, 5, undefined, signal);
  });

  function handleClickShare() {
    navigate("/sign-up");
  }

  return (
    <div className={styles.container}>
      <div className={styles["hero-section"]}>
        <div className={styles["hero-text"]}>
          <h1>Listen Independent. </h1>
          <h1>Support Independent.</h1>
        </div>
        <Button className={styles["hero-button"]} onClick={handleClickShare}>
          <TbPlayerPlayFilled /> share music
        </Button>
      </div>
      {release && (
        <div className={styles["titled-section"]}>
          <h1 className={styles.title}>Release of the day</h1>
          <div className={styles["release-of-day"]}>
            <div
              className={styles["cover-container"]}
              onClick={() => navigate(`/releases/${release.slug}`)}
            >
              <img
                className={styles.cover}
                src={release.coverUrl}
                alt="cover preview"
              />
            </div>
            <div className={styles["right-side"]}>
              <div className={styles["release-info"]}>
                <Link
                  className={styles["release-link"]}
                  to={`/releases/${release.slug}`}
                >
                  <h1>{release.name}</h1>
                </Link>
                <div className={styles["release-bottom-info"]}>
                  <ArtistsLinks artists={release.artists} />
                  <div className={styles["iconed-info-container"]}>
                    <span className={styles["iconed-info"]}>
                      {formatDate(release.releaseDate)}
                    </span>
                    <span className={styles["iconed-info"]}>
                      <TbList /> {release.tracks.length}
                    </span>
                    <span className={styles["iconed-info"]}>
                      <TbClock />
                      {formatSeconds(totalDuration)}
                    </span>
                  </div>
                </div>
              </div>
              <TrackList
                onTotalDurationChange={setTotalDuration}
                className={styles.tracks}
                tracks={release.tracks}
              />
            </div>
          </div>
        </div>
      )}

      {releases && (
        <div className={styles["titled-section"]}>
          <h1 className={styles.title}>Latest releases</h1>
          <div className={styles["latest-releases"]}>
            <ReleaseList releases={releases.data} />
            <div className={styles["button-container"]}>
              <Button
                className={styles["see-more-button"]}
                onClick={() => navigate("/releases")}
              >
                See more
              </Button>{" "}
            </div>
          </div>
        </div>
      )}
      <Separator />
      <Footer />
    </div>
  );
};

export default HomePage;
