import styles from "./Separator.module.css";

import * as RxSeparator from "@radix-ui/react-separator";

const Separator = () => {
  return (
    <RxSeparator.Root
      className={styles.separator}
      decorative
      orientation="horizontal"
      style={{ margin: "15px 0" }}
    />
  );
};

export default Separator;
