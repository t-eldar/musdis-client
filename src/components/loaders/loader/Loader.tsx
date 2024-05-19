import { combineClassNames } from "@utils/style-utils";
import styles from "./Loader.module.css";
import { ComponentProps } from "react";
import DotLoader from "react-spinners/DotLoader";

type LoaderProps = ComponentProps<typeof DotLoader> & {
  className?: string;
};

const Loader = (props: LoaderProps) => {
  return (
    <div className={combineClassNames(styles.container, props.className)}>
      <DotLoader color={props.color || "var(--accent)"} {...props} />
    </div>
  );
};

export default Loader;
