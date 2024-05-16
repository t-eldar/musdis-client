import ErrorMessage from "@components/forms/shared/error-message";
import styles from "./SignInForm.module.css";

import { Button } from "@components/ui/button";
import { TextField } from "@components/ui/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@hooks/use-sign-in";
import { combineClassNames } from "@utils/style-utils";
import { isAxiosError } from "axios";
import { ComponentProps, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Form from "@components/ui/form";

const formSchema = z.object({
  userNameOrEmail: z.string(),
  password: z.string(),
});

type FormFields = z.infer<typeof formSchema>;

type SignInFormProps = ComponentProps<"div"> & {
  onSuccess?: () => void;
};

const SignInForm = ({ onSuccess, ...props }: SignInFormProps) => {
  const className = props.className;
  const unstyledProps = { ...props };
  delete unstyledProps.className;

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const { invoke: invokeSignIn, error } = useSignIn();

  useEffect(() => {
    if (isAxiosError(error)) {
      setError("root", {
        message:
          error.response?.status === 401
            ? "Incorrect username or password"
            : error.message,
      });
    }
  }, [error, setError]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const result = await invokeSignIn(data);
    if (result === "success") {
      clearErrors();
      onSuccess?.();
    }
  };

  return (
    <div
      className={combineClassNames(styles.container, className)}
      {...unstyledProps}
    >
      <h1>Sign in</h1>
      <Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
          {errors.root && (
            <ErrorMessage>
              {errors.root.message || "Something went wrong"}
            </ErrorMessage>
          )}
        </div>
      </Form>
    </div>
  );
};

export default SignInForm;
