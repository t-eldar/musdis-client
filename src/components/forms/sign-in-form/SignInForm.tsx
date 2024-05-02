import styles from "./SignInForm.module.css";

import { TextField } from "@components/ui/text-field";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";
import { FaExclamationCircle } from "react-icons/fa";
import { useSignIn } from "@hooks/use-sign-in";
import { useEffect } from "react";

const formSchema = z.object({
  userNameOrEmail: z.string(),
  password: z.string(),
});

type FormFields = z.infer<typeof formSchema>;

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const { invoke: invokeSignIn, isLoading, error } = useSignIn();

  useEffect(() => {
    if (error?.message) {
      setError("root", {
        message: error?.message,
      });
    }
  }, [error, setError]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const result = await invokeSignIn(data);
    if (result === "success") {
      clearErrors();
    }
  };

  const checkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.container}>
      <h1>Sign in</h1>
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => checkKeyDown(e)}
        noValidate
      >
        <div className={styles["labeled-field"]}>
          <label htmlFor="username">
            Username <br />
            or email
          </label>
          <TextField
            id="username"
            type="text"
            placeholder="Enter your username or email."
            {...register("userNameOrEmail")}
          />
        </div>
        <div className={styles["labeled-field"]}>
          <label htmlFor="password">Password</label>
          <TextField
            id="password"
            type="password"
            placeholder="Enter your password."
            {...register("password")}
          />
        </div>
        <div className={styles["submit-container"]}>
          <Button type="submit" disabled={isSubmitting}>
            Sign in
          </Button>
        </div>
      </form>
      {errors.root && (
        <span className={styles.error}>
          <FaExclamationCircle />
          {" " + errors.root.message}
        </span>
      )}
    </div>
  );
};

export default SignInForm;
