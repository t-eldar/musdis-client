import { PropsWithChildren } from "react";
import styles from "./ErrorMessage.module.css";

import { FaExclamationCircle } from "react-icons/fa";

type ErrorMessageProps = PropsWithChildren;
const ErrorMessage = ({ children }: ErrorMessageProps) => {
  return (
    <span className={styles.error}>
      <FaExclamationCircle style={{ marginRight: "5px" }} />
      {children}
    </span>
  );
};

export default ErrorMessage;
