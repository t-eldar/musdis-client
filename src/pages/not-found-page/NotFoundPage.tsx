import styles from "./NotFoundPage.module.css";

import { TbMusicSearch } from "react-icons/tb";
import { Button } from "@components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles["main-block"]}>
        <div className={styles["error-block"]}>
          <h1 className={styles.code}>404</h1>
          <div className={styles["message-block"]}>
            <span className={styles.message}>Page is not found!</span>
            <Button
              className={styles["go-home-button"]}
              onClick={() => navigate("/")}
            >
              <TbMusicSearch /> Go to home
            </Button>
          </div>
        </div>
        <div className={styles.image} />
      </div>
    </div>
  );
};

export default NotFoundPage;
