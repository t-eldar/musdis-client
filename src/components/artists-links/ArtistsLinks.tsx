import { Link } from "react-router-dom";
import styles from "./ArtistsLinks.module.css";
import { combineClassNames } from "@utils/style-utils";

type ArtistsLinksProps = {
  className?: string;
  artists: {
    name: string;
    slug: string;
  }[];
};

const ArtistsLinks = ({ artists, className }: ArtistsLinksProps) => {
  return (
    <div className={combineClassNames(styles["container"], className)}>
      {artists.map((artist, i) => (
        <div key={artist.slug}>
          {i !== 0 && ", "}
          <Link
            to={`/artists/${artist.slug}`}
            className={styles["link"]}
            onClick={(e) => e.stopPropagation()}
          >
            {artist.name}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ArtistsLinks;
