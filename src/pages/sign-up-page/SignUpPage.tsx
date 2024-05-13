import styles from "./SignUpPage.module.css";

import { Separator } from "@components/ui/separator";
import { SignUpForm } from "@components/forms/sign-up-form";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <SignUpForm className={styles.form} onSuccess={() => navigate(-1)} />

      <span className={styles.text}>Already have an account?</span>
      <Link className={styles.link} to="/sign-in">
        Sign In!
      </Link>
      <Separator />
    </div>
  );
};

export default SignUpPage;
