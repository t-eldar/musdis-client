import TapeLoader from "@components/loaders/tape-loader/TapeLoader";
import styles from "./PageLoader.module.css";

import { Loader } from "@components/loaders/loader";

const PageLoader = () => {
  return (
    <div className={styles.container}>
      <TapeLoader />
    </div>
  );
};

export default PageLoader;
