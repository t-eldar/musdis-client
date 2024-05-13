import styles from "./ImageUploader.module.css";

import { Button } from "@components/ui/button";
import { formatBytes } from "@utils/file-utils";
import { useCallback, useEffect, useState } from "react";
import { DropzoneRootProps, useDropzone } from "react-dropzone";
import { IconContext } from "react-icons/lib";
import { TbFileUpload, TbX } from "react-icons/tb";

import useAlert from "@hooks/use-alert";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";

type ImageUploaderProps = {
  onSubmit:
    | ((file: File, preview: string) => void)
    | ((file: File, preview: string) => Promise<void>);
  error?: string;
  isLoading?: boolean;
};

export const ImageUploader = ({
  onSubmit,
  error,
  isLoading,
}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [acceptedFile, setAcceptedFile] = useState<File>();

  const [submitted, setSubmitted] = useState(false);

  const alert = useAlert();

  const onDrop = useCallback((acceptedFiles: File[]): void => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreview(fileReader.result);
    };

    setAcceptedFile(acceptedFiles[0]);
    fileReader.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: { "image/*": [] },
  });

  useEffect(() => {
    if (error && submitted) {
      console.log("error", error);

      alert({
        variant: "warning",
        message: error,
        title: "Upload error",
      });
    }
  }, [error, submitted, alert]);

  function handleRemove() {
    setPreview(null);
    setAcceptedFile(undefined);
  }

  async function handleSubmit() {
    if (acceptedFile && preview) {
      setSubmitted(true);
      if (onSubmit instanceof Promise) {
        await onSubmit(acceptedFile, preview as string);
      } else {
        onSubmit(acceptedFile, preview as string);
      }
    }
  }

  return (
    <div className={styles.container}>
      <div
        {...getRootProps<DropzoneRootProps>({
          className: styles["dropzone-root"],
          "aria-label": "Drag and drop area.",
        })}
      >
        <input {...getInputProps()} />
        {preview ? (
          <AspectRatio.Root ratio={1}>
            <img
              className={styles.preview}
              src={preview as string}
              alt="Upload preview"
            />
          </AspectRatio.Root>
        ) : (
          <div className={styles["dropzone-text-container"]}>
            <IconContext.Provider
              value={{ className: styles.icon, size: "4rem" }}
            >
              <span className={styles["dropzone-text"]}>
                {isDragActive
                  ? "Drop the image here..."
                  : "Drag 'n' drop your image, or click to select files"}
              </span>
              {isDragActive ? <TbFileUpload /> : <TbFileUpload />}
            </IconContext.Provider>
          </div>
        )}
      </div>
      <div className={styles["preview-button-container"]}>
        {preview && acceptedFile && (
          <div className={styles["preview-list"]}>
            <span className={styles["preview-text"]}>
              {acceptedFile.name} - {formatBytes(acceptedFile.size)}
            </span>
            <Button className={styles["remove-button"]} onClick={handleRemove}>
              <TbX />
            </Button>
          </div>
        )}
        <Button onClick={handleSubmit} disabled={isLoading === true}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;
