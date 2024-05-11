import { Button } from "@components/ui/button";
import styles from "./AudioUploader.module.css";

import { useCallback, useState } from "react";
import { DropzoneRootProps, useDropzone } from "react-dropzone";
import { IconContext } from "react-icons/lib";
import { TbFileUpload, TbX } from "react-icons/tb";
import { formatBytes } from "@utils/file-utils";

type AudioUploaderProps = {
  onSubmit: ((file: File) => void) | ((file: File) => Promise<void>);
  onFileNameChange?: (name: string) => void;
  error?: string;
};

const AudioUploader = ({
  onSubmit,
  onFileNameChange,
  error,
}: AudioUploaderProps) => {
  const [acceptedFile, setAcceptedFile] = useState<File>();

  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]): void => {
    const fileReader = new FileReader();
    setAcceptedFile(acceptedFiles[0]);
    fileReader.readAsDataURL(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: { "audio/*": [] },
  });

  function handleRemove() {
    setAcceptedFile(undefined);
  }

  async function handleSubmit() {
    setLoading(true);
    if (acceptedFile) {
      if (onSubmit.constructor.name === "AsyncFunction") {
        await onSubmit(acceptedFile);
      } else {
        onSubmit(acceptedFile);
      }

      onFileNameChange?.(acceptedFile.name);
    }
    setLoading(false);
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
        <div className={styles["dropzone-text-container"]}>
          <IconContext.Provider value={{ size: "4rem" }}>
            <span>
              {isDragActive
                ? "Drop the audio here..."
                : "Drag 'n' drop your audio, or click to select file"}
            </span>
            {isDragActive ? <TbFileUpload /> : <TbFileUpload />}
          </IconContext.Provider>
        </div>
      </div>
      <div className={styles["preview-button-container"]}>
        {acceptedFile && (
          <div className={styles["preview-list"]}>
            <span className={styles["preview-text"]}>
              {acceptedFile.name} - {formatBytes(acceptedFile.size)}
            </span>
            <Button className={styles["remove-button"]} onClick={handleRemove}>
              <TbX />
            </Button>
          </div>
        )}
        <Button onClick={handleSubmit} disabled={loading}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AudioUploader;
