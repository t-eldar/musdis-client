import { combineClassNames } from "@utils/style-utils";
import styles from "./TapeLoader.module.css";

const TapeLoader = () => {
  return (
    <div className={styles["k-container-body"]}>
      <span
        className={combineClassNames(styles["k-screw"], styles["top-left"])}
      ></span>
      <span
        className={combineClassNames(styles["k-screw"], styles["top-right"])}
      ></span>
      <span
        className={combineClassNames(styles["k-screw"], styles["bottom-left"])}
      ></span>
      <span
        className={combineClassNames(styles["k-screw"], styles["bottom-right"])}
      ></span>
      <div className={styles["k-centerreel"]}>
        <div
          className={combineClassNames(styles["reel"], styles["left"])}
        ></div>
        <div className={styles["center-tape"]}></div>
        <div
          className={combineClassNames(styles["reel"], styles["right"])}
        ></div>
      </div>
      <div className={styles["k-label"]}>
        <h1 className={styles["center"]}>Loading...</h1>
      </div>
      <div className={styles["k-chin"]}>
        <span className={styles["holes"]}></span>
        <span className={styles["holes"]}></span>
        <span className={styles["holes"]}></span>
        <span className={styles["holes"]}></span>
      </div>
    </div>
  );
};

export default TapeLoader;
