import styles from "./SignInPage.module.css";

import { Footer } from "@components/footer";
import { SignInForm } from "@components/forms/authentication/sign-in-form";
import { Separator } from "@components/ui/separator";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  function handleSuccess() {
    navigate(location.state?.from || "/profile", { replace: true });
  }

  return (
    <div className={styles.container}>
      <div className={styles["form-container"]}>
        <div className={styles["image"]}>
          <h1>Sign in</h1>
        </div>
        <div>
          <SignInForm className={styles.form} onSuccess={handleSuccess} />

          <div className={styles["link-container"]}>
            <span className={styles.text}>Already have an account?</span>
            <Link className={styles.link} to="/sign-up">
              Sign up!
            </Link>
          </div>
        </div>
      </div>
      <Separator />
      <Footer />
    </div>
  );
};

export default SignInPage;
