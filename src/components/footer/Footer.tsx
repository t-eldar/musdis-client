import styles from "./Footer.module.css";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles["content-container"]}>
        <div className={styles.content}>
          <h3>About</h3>
          <div>
            <span className={styles.accent}>musdis </span>
            <span>
              is the go-to platform for discovering and sharing independent
              music. We believe in the power of music to connect people and
              communities, and our mission is to shine a spotlight on talented,
              independent artists who deserve to be heard.
            </span>
          </div>
        </div>
        <div className={styles.content}>
          <h3>Links</h3>
          <Link
            to="https://github.com/t-eldar/musdis-client"
            className={styles.link}
            target="_blank"
          >
            frontend repo
          </Link>
          <Link
            to="https://github.com/t-eldar/musdis-server"
            className={styles.link}
            target="_blank"
          >
            backend repo
          </Link>
        </div>
      </div>
      <span>
        2024 -{" "}
        <Link className={styles.link} to="https://github.com/t-eldar">
          t-eldar
        </Link>
      </span>
    </div>
  );
};

export default Footer;
