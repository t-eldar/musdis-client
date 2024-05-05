import { Link, useNavigate } from "react-router-dom";
import styles from "./ReleaseList.module.css";

import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { ComponentProps } from "react";
import { combineClassNames } from "@utils/style-utils";

type ReleaseListProps = ComponentProps<"ul"> & {
  releases: {
    slug: string;
    name: string;
    coverUrl: string;
    artists: {
      slug: string;
      name: string;
    }[];
  }[];
};

const ReleaseList = ({ releases, ...rest }: ReleaseListProps) => {
  const navigate = useNavigate();

  return (
    <ul className={combineClassNames(styles.list, rest.className)} {...rest}>
      {releases.map((release) => (
        <li key={release.slug} className={styles.item}>
          <AspectRatio.Root
            className={styles["cover-container"]}
            onClick={() => navigate(`/releases/${release.slug}`)}
          >
            <img className={styles.cover} src={release.coverUrl} />
          </AspectRatio.Root>
          <Link
            className={styles["release-link"]}
            to={`/releases/${release.slug}`}
          >
            {release.name}
          </Link>
          <div className={styles["artists-container"]}>
            {release.artists.map((artist, index) => (
              <div>
                {index !== 0 && ", "}
                <Link
                  key={artist.slug}
                  to={`/artist/${artist.slug}`}
                  className={styles["artist-link"]}
                >
                  {artist.name}
                </Link>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ReleaseList;
