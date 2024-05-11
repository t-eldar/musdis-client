import ErrorMessage from "@components/forms/shared/error-message";
import styles from "./ErrorTip.module.css";

import { ComponentProps, PropsWithChildren } from "react";
import { combineClassNames } from "@utils/style-utils";

type ErrorTipProps = PropsWithChildren &
  ComponentProps<"div"> & {
    open: boolean;
  };

const ErrorTip = ({ open, children, ...rest }: ErrorTipProps) => {
  const className = rest.className;
  const unstyledProps = { ...rest };
  delete unstyledProps.className;
  if (open) {
    return (
      <div className={combineClassNames(styles.container, className)}>
        <ErrorMessage>{children}</ErrorMessage>
      </div>
    );
  }
};

export default ErrorTip;
