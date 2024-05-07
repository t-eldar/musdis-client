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

  function getCardClassName(index: number) {
    let className = "";
    if (index % 5 === 0) {
      className = styles["card-doubled"];
    } else {
      className = styles["card"];
    }

    return combineClassNames(className, styles.card);
  }

  return (
    <ul
      className={combineClassNames(styles["grid-container"], rest.className)}
      {...rest}
    >
      {releases.map((release, index) => (
        <li
          key={release.id}
          className={getCardClassName(index)}
          style={{ "--bg-image": `url(${release.coverUrl})` } as CSSProperties}
          onClick={() => navigate(`/releases/${release.slug}`)}
        >
          {/* <div className={styles["cover-container"]}>
            <img className={styles.cover} src={release.coverUrl} />
          </div> */}
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
