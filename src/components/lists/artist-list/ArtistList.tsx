import { TbUser, TbUsers } from "react-icons/tb";
import styles from "./ArtistList.module.css";
import { IconContext } from "react-icons/lib";
import { useNavigate } from "react-router-dom";
import { CSSProperties } from "react";

type ArtistListProps = {
  artists: {
    name: string;
    slug: string;
    coverUrl: string;
    type: {
      name: string;
      slug: string;
    };
  }[];
};

const ArtistList = ({ artists }: ArtistListProps) => {
  const navigate = useNavigate();
  return (
    <ul className={styles.list}>
      {artists.map((artist) => (
        <li
          key={artist.slug}
          className={styles.item}
          style={
            {
              "--bg-image-artist": `url(${artist.coverUrl})`,
            } as CSSProperties
          }
          onClick={() => {
            navigate(`/musicians/${artist.slug}`);
          }}
        >
          <div className={styles.info}>
            <h3 className={styles.title}>{artist.name}</h3>
            <IconContext.Provider
              value={{ className: styles.icon, size: "2rem" }}
            >
              {artist.type.slug === "band" ? <TbUsers /> : <TbUser />}
            </IconContext.Provider>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ArtistList;
