import styles from "./SignInPage.module.css";

import { SignInForm } from "@components/forms/sign-in-form";
import { Separator } from "@components/ui/separator";
import { Link } from "react-router-dom";

const SignInPage = () => {
  return (
    <div className={styles.container}>
      <SignInForm className={styles.form} />

      <span className={styles.text}>Don't have an account?</span>
      <Link className={styles.link} to="/sign-up">
        Sign Up!
      </Link>
      <Separator />
    </div>
  );
};

export default SignInPage;
