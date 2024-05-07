import { useNavigate } from "react-router-dom";
import styles from "./ReleaseList.module.css";

import { ArtistsLinks } from "@components/artists-links";
import { combineClassNames } from "@utils/style-utils";
import { ComponentProps } from "react";
import { TbList } from "react-icons/tb";

type ReleaseListProps = ComponentProps<"ul"> & {
  releases: {
    slug: string;
    name: string;
    coverUrl: string;
    artists: {
      slug: string;
      name: string;
    }[];
    tracks: {
      slug: string;
    }[];
  }[];
};

const ReleaseList = ({ releases, ...rest }: ReleaseListProps) => {
  const navigate = useNavigate();

  return (
    <ul className={combineClassNames(styles.list, rest.className)} {...rest}>
      {releases.map((release) => (
        <li
          key={release.slug}
          className={styles.item}
          onClick={() => navigate(`/releases/${release.slug}`)}
        >
          <div className={styles["cover-container"]}>
            <img className={styles.cover} src={release.coverUrl} />
          </div>
          <div className={styles["info-container"]}>
            <span className={styles["release-link"]}>{release.name}</span>
            <div className={styles["artists-container"]}>
              <ArtistsLinks
                artists={release.artists}
                className={styles["artists"]}
              />
              <div className={styles["total-tracks"]}>
                <TbList />
                {release.tracks.length}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ReleaseList;
