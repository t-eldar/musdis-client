import styles from "./SignUpForm.module.css";

import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";

import { TextField } from "@components/ui/text-field";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaExclamationCircle } from "react-icons/fa";
import { z } from "zod";
import { Button } from "@components/ui/button";
import { Dispatch, useState } from "react";
import { TbUpload, TbX } from "react-icons/tb";
import ImageUploader from "@components/file-uploaders/image-uploader";

const formSchema = z
  .object({
    username: z.string(),
    email: z.string(),
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

type FileUploadModalProps = {
  onImageSubmit: (file: File, preview: string) => void;
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
};
const FileUploadModal = ({
  onImageSubmit,
  open,
  setOpen,
}: FileUploadModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles["dialog-overlay"]} />
        <Dialog.Content className={styles["dialog-content"]}>
          <ImageUploader onSubmit={onImageSubmit} />
          <Dialog.Close asChild>
            <Button className={styles["icon-button"]}>
              <TbX />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const SignUpForm = () => {
  const [avatarFile, setAvatarFile] = useState<{ id: string; url: string }>();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  //TODO add server interaction
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error(data.password);
    } catch (error) {
      setError("root", {
        message: "This email is already taken",
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

  function handleImageSubmit(file: File, preview: string) {
    console.log(file);
    setAvatarFile({ id: file.name, url: preview });
  }

  return (
    <>
      <FileUploadModal
        open={open}
        setOpen={setOpen}
        onImageSubmit={handleImageSubmit}
      />
      <div className={styles.container}>
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
              {...register("username")}
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
        {errors.root && (
          <span className={styles.error}>
            <FaExclamationCircle />
            {" " + errors.root.message}
          </span>
        )}
      </div>
    </>
  );
};

export default SignUpForm;
