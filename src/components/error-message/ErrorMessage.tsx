import styles from "./ErrorMessage.module.css";

import { FaExclamationCircle } from "react-icons/fa";

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <span className={styles.error}>
      <FaExclamationCircle />
      {" " + message}
    </span>
  );
};

export default ErrorMessage;
