import { useNavigate } from "react-router-dom";
import styles from "./MosaicReleaseList.module.css";

import { ArtistsLinks } from "@components/artists-links";
import { combineClassNames } from "@utils/style-utils";
import { CSSProperties, ComponentProps } from "react";
import { TbList } from "react-icons/tb";

type MosaicReleaseListProps = ComponentProps<"ul"> & {
  releases: {
    id: string;
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

const MosaicReleaseList = ({ releases, ...rest }: MosaicReleaseListProps) => {
  const navigate = useNavigate();

  return (
    <ul
      className={combineClassNames(styles["grid-container"], rest.className)}
      {...rest}
    >
      {releases.map((release) => (
        <li
          key={release.id}
          className={styles.card}
          style={{ "--bg-image": `url(${release.coverUrl})` } as CSSProperties}
          onClick={() => navigate(`/releases/${release.slug}`)}
        >
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

export default MosaicReleaseList;
