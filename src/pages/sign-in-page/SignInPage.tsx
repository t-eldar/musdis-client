import styles from "./SignInPage.module.css";

import { SignInForm } from "@components/forms/sign-in-form";
import { Separator } from "@components/ui/separator";
import { useAuthStore } from "@stores/auth-store";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignInPage = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/profile", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className={styles.container}>
      <SignInForm className={styles.form} onSuccess={() => navigate(-1)} />

      <span className={styles.text}>Don't have an account?</span>
      <Link className={styles.link} to="/sign-up">
        Sign Up!
      </Link>
      <Separator />
    </div>
  );
};

export default SignInPage;
