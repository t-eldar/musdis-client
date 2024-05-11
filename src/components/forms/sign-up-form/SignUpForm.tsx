import styles from "./SignUpForm.module.css";

import { zodResolver } from "@hookform/resolvers/zod";

import ErrorMessage from "@components/forms/shared/error-message";
import ErrorTip from "@components/forms/shared/error-tip";
import { Button } from "@components/ui/button";
import { TextField } from "@components/ui/text-field";
import { useSignUp } from "@hooks/use-sign-up";
import { combineClassNames } from "@utils/style-utils";
import { isAxiosError } from "axios";
import { ComponentProps } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    userName: z.string(),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "The passwords did not match",
      });
    }
  });

type FormFields = z.infer<typeof formSchema>;

export const SignUpForm = (props: ComponentProps<"div">) => {
  const { className, ...unstyledProps } = props;

  const { invoke: invokeSignUp, error: signUpError } = useSignUp();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log(errors);

    const result = await invokeSignUp(data);
    if (result === "error") {
      if (isAxiosError(signUpError) && signUpError.response?.status === 409) {
        setError("userName", {
          message: "This username is already taken",
        });

        return;
      }
      setError("root", {
        message:
          signUpError?.message ||
          "Something went wrong. Please try again later.",
      });
    }
  };

  function checkKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  return (
    <>
      <div
        className={combineClassNames(styles.container, className)}
        {...unstyledProps}
      >
        <h1>Sign up</h1>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
          noValidate
        >
          <div className={styles["labeled-field"]}>
            <label htmlFor="username">Username</label>
            <TextField
              id="username"
              type="text"
              placeholder="Enter your username."
              {...register("userName")}
            />
            <ErrorTip
              open={!!errors.userName}
              className={styles["error-tip-field"]}
            >
              {errors.userName?.message}
            </ErrorTip>
          </div>
          <div className={styles["labeled-field"]}>
            <label htmlFor="email">Email</label>
            <TextField
              id="email"
              type="email"
              placeholder="Enter your email."
              {...register("email")}
            />
            <ErrorTip
              open={!!errors.email}
              className={styles["error-tip-field"]}
            >
              {errors.email?.message}
            </ErrorTip>
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
          <div className={styles["labeled-field"]}>
            <label htmlFor="confirmPassword">Confirm your password</label>
            <TextField
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password."
              {...register("confirmPassword")}
            />
            <ErrorTip
              open={!!errors.confirmPassword}
              className={styles["error-tip-field"]}
            >
              {errors.confirmPassword?.message}
            </ErrorTip>
          </div>
          <div className={styles["submit-container"]}>
            <Button type="submit" disabled={isSubmitting}>
              Sign up
            </Button>
          </div>
        </form>

        {errors.root && errors.root.message && (
          <ErrorMessage>{errors.root.message}</ErrorMessage>
        )}
      </div>
    </>
  );
};

export default SignUpForm;
