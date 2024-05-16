import styles from "./SignInPage.module.css";

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
      <SignInForm className={styles.form} onSuccess={handleSuccess} />

      <span className={styles.text}>Don't have an account?</span>
      <Link className={styles.link} to="/sign-up">
        Sign Up!
      </Link>
      <Separator />
    </div>
  );
};

export default SignInPage;
