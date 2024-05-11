import { combineClassNames } from "@utils/style-utils";
import styles from "./Loader.module.css";
import { ComponentProps } from "react";
import BounceLoader from "react-spinners/BounceLoader";

type LoaderProps = ComponentProps<typeof BounceLoader> & {
  className?: string;
};

const Loader = (props: LoaderProps) => {
  return (
    <div className={combineClassNames(styles.container, props.className)}>
      <BounceLoader color={props.color || "var(--accent)"} {...props} />
    </div>
  );
};

export default Loader;
