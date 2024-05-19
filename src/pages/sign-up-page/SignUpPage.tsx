import styles from "./SignUpPage.module.css";

import { Footer } from "@components/footer";
import { SignUpForm } from "@components/forms/authentication/sign-up-form";
import { Separator } from "@components/ui/separator";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles["form-container"]}>
        <div className={styles["image"]}>
          <h1>Sign up</h1>
        </div>
        <div>
          <SignUpForm className={styles.form} onSuccess={() => navigate(-1)} />

          <div className={styles["link-container"]}>
            <span className={styles.text}>Already have an account?</span>
            <Link className={styles.link} to="/sign-in">
              Sign In!
            </Link>
          </div>
        </div>
      </div>
      <Separator />
      <Footer />
    </div>
  );
};

export default SignUpPage;
