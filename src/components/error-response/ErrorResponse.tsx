import { Link, useNavigate } from "react-router-dom";
import styles from "./ErrorResponse.module.css";
import Button from "@components/ui/button";
import { TbHeadphonesOff, TbHome } from "react-icons/tb";

const ErrorResponse = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles["main-block"]}>
        <div className={styles["error-block"]}>
          <TbHeadphonesOff className={styles.icon} size="15rem"/>
          <h1 className={styles.title}>Something went wrong</h1>
          <div className={styles.message}>we are working on it</div>
          <Button className={styles.button} onClick={() => navigate("/")}>
            <TbHome />
            Go home
          </Button>
        </div>
        <div className={styles.image}></div>
      </div>
    </div>
  );
};

export default ErrorResponse;
