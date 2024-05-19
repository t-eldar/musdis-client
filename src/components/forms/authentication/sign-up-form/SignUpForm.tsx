import styles from "./SignUpForm.module.css";

import { zodResolver } from "@hookform/resolvers/zod";

import ErrorMessage from "@components/forms/shared/error-message";
import ErrorTip from "@components/forms/shared/error-tip";
import { Button } from "@components/ui/button";
import Form from "@components/ui/form";
import { TextField } from "@components/ui/text-field";
import { useSignUp } from "@hooks/use-sign-up";
import { combineClassNames } from "@utils/style-utils";
import { isAxiosError } from "axios";
import { ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { containsLowercase, containsUppercase } from "@utils/validation-utils";

const formSchema = z
  .object({
    userName: z.string().min(3).max(12),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine(({ userName }) => !userName.includes(" "), {
    message: "Username cannot contain spaces",
    path: ["userName"],
  })
  .refine(({ password }) => containsUppercase(password), {
    message: "Password must contain at least one uppercase character",
    path: ["password"],
  })
  .refine(({ password }) => containsLowercase(password), {
    message: "Password must contain at least one lowercase character",
    path: ["password"],
  })
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    path: ["confirmPassword"],
    message: "The passwords did not match",
  });

type FormFields = z.infer<typeof formSchema>;

type SignUpFormProps = ComponentProps<"div"> & {
  onSuccess?: () => void;
};

export const SignUpForm = ({ onSuccess, ...props }: SignUpFormProps) => {
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

  async function onSubmit(data: FormFields) {
    const result = await invokeSignUp(data);
    if (result === "error") {
      if (isAxiosError(signUpError) && signUpError.response?.status === 409) {
        setError("userName", {
          message: "Username or email is already taken",
        });

        return;
      }
      setError("root", {
        message:
          signUpError?.message ||
          "Something went wrong. Please try again later.",
      });
    } else {
      onSuccess?.();
    }
  }

  return (
    <>
      <div
        className={combineClassNames(styles.container, className)}
        {...unstyledProps}
      >
        <Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
            <ErrorTip
              open={!!errors.password}
              className={styles["error-tip-field"]}
            >
              {errors.password?.message}
            </ErrorTip>
          </div>

          <div className={styles["labeled-field"]}>
            <label htmlFor="confirmPassword">Confirm password</label>
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
        </Form>

        {errors.root && errors.root.message && (
          <ErrorMessage>{errors.root.message}</ErrorMessage>
        )}
      </div>
    </>
  );
};

export default SignUpForm;
