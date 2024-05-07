import styles from "./SignUpForm.module.css";

import { zodResolver } from "@hookform/resolvers/zod";
import * as Avatar from "@radix-ui/react-avatar";

import { ImageUploader } from "@components/file-uploaders/image-uploader";
import { Button } from "@components/ui/button";
import { Modal } from "@components/ui/modal";
import { TextField } from "@components/ui/text-field";
import { useAwait } from "@hooks/use-await";
import { useSignUp } from "@hooks/use-sign-up";
import { uploadFile } from "@services/files";
import { ComponentProps, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaExclamationCircle } from "react-icons/fa";
import { TbUpload } from "react-icons/tb";
import { z } from "zod";
import { combineClassNames } from "@utils/style-utils";
import ErrorMessage from "@components/error-message";

const formSchema = z
  .object({
    userName: z.string(),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
    avatarFile: z.object({
      id: z.string().uuid(),
      url: z.string().url(),
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The passwords did not match",
      });
    }
  });

type FormFields = z.infer<typeof formSchema>;

export const SignUpForm = (props: ComponentProps<"div">) => {
  const className = props.className;
  const unstyledProps = { ...props };
  delete unstyledProps.className;

  const [avatarFile, setAvatarFile] = useState<{ id: string; url: string }>();
  const [open, setOpen] = useState(false);

  const { promise: uploadImage, error: uploadError } =
    useAwait<typeof uploadFile>(uploadFile);

  const { invoke: invokeSignUp, error: signUpError } = useSignUp();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log(errors);

    const result = await invokeSignUp(data);
    if (result === "error") {
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

  function handleOpenFileUpload() {
    setOpen(true);
  }

  async function handleImageSubmit(file: File) {
    const result = await uploadImage(file);
    if (result) {
      setAvatarFile({ id: result.id, url: result.url });
      setValue("avatarFile", { id: result.id, url: result.url });
      setOpen(false);
    }
  }

  return (
    <>
      <Modal open={open} onOpenChange={setOpen}>
        <ImageUploader
          onSubmit={handleImageSubmit}
          error={uploadError?.message}
        />
      </Modal>
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
          <Avatar.Root className={styles["avatar-root"]}>
            <Avatar.Image
              className={styles["avatar-image"]}
              src={avatarFile?.url}
              alt="Avatar"
              onClick={handleOpenFileUpload}
            />
            <Avatar.Fallback
              className={styles["avatar-fallback"]}
              onClick={handleOpenFileUpload}
            >
              <TbUpload size={"2rem"} />
            </Avatar.Fallback>
          </Avatar.Root>
          <div className={styles["labeled-field"]}>
            <label htmlFor="username">Username</label>
            <TextField
              id="username"
              type="text"
              placeholder="Enter your username."
              {...register("userName")}
            />
          </div>
          <div className={styles["labeled-field"]}>
            <label htmlFor="email">Email</label>
            <TextField
              id="email"
              type="email"
              placeholder="Enter your email."
              {...register("email")}
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
          <div className={styles["labeled-field"]}>
            <label htmlFor="confirmPassword">Confirm your password</label>
            <TextField
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password."
              {...register("confirmPassword")}
            />
          </div>
          <div className={styles["submit-container"]}>
            <Button type="submit" disabled={isSubmitting}>
              Sign up
            </Button>
          </div>
        </form>

        {errors.root && errors.root.message && (
          <ErrorMessage message={errors.root.message} />
        )}
      </div>
    </>
  );
};

export default SignUpForm;
