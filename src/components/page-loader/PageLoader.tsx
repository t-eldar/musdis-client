import styles from "./PageLoader.module.css";

import { Loader } from "@components/loader";

const PageLoader = () => {
  return <Loader className={styles.loader} size={250} />;
};

export default PageLoader;
