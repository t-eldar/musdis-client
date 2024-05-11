import styles from "./CreateArtistForm.module.css";

import { ImageUploader } from "@components/file-uploaders/image-uploader";
import ErrorMessage from "@components/forms/shared/error-message";
import ErrorTip from "@components/forms/shared/error-tip";
import { Button } from "@components/ui/button";
import { Modal } from "@components/ui/modal";
import Select from "@components/ui/select";
import { TextField } from "@components/ui/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAwait } from "@hooks/use-await";
import { useFetch } from "@hooks/use-fetch";
import { getArtistTypes } from "@services/artist-types";
import { createArtist } from "@services/artists";
import { uploadFile } from "@services/files";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TbFileUpload } from "react-icons/tb";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  artistTypeSlug: z.string(),
  coverFile: z.object(
    {
      id: z.string().uuid(),
      url: z.string().url(),
    },
    {
      required_error: "Please upload a cover image.",
    }
  ),
  userIds: z.string().uuid().array().optional(),
});
type FormFields = z.infer<typeof formSchema>;

type CreateArtistFormProps = {
  onCreated?: () => void;
};

const CreateArtistForm = ({ onCreated }: CreateArtistFormProps) => {
  const {
    data: artistTypes,
    isLoading: isArtistTypesLoading,
    error: artistTypesError,
  } = useFetch(async (signal) => {
    return await getArtistTypes(signal);
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const [isFileUploaderOpen, setIsFileUploaderOpen] = useState(false);
  const [cover, setCover] = useState<{ id: string; url: string }>();
  const {
    promise: uploadImage,
    isLoading: isUploadLoading,
    error: uploadError,
  } = useAwait<typeof uploadFile>(uploadFile);

  const {
    promise: invokeCreateArtist,
    isLoading: isCreateLoading,
    error: createError,
  } = useAwait(createArtist);

  async function onSubmit(data: FormFields) {
    const result = await invokeCreateArtist(data);

    if (isAxiosError(createError) && createError.response?.status === 409) {
      setError("name", {
        message: "The artist with this name already exists.",
      });

      return;
    }
    if (createError) {
      setError("root", { message: createError.message });
    }

    if (result) {
      onCreated?.();
    }
  }

  async function handleImageSubmit(file: File) {
    const result = await uploadImage(file);
    if (result) {
      setCover({ id: result.id, url: result.url });
      setValue("coverFile", { id: result.id, url: result.url });
      setIsFileUploaderOpen(false);
    }
  }

  function checkKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  return (
    <>
      <Modal open={isFileUploaderOpen} onOpenChange={setIsFileUploaderOpen}>
        <ImageUploader
          onSubmit={handleImageSubmit}
          isLoading={isUploadLoading}
          error={uploadError?.message}
        />
      </Modal>
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => checkKeyDown(e)}
        noValidate
      >
        <div>
          <div
            className={styles["cover-container"]}
            onClick={() => setIsFileUploaderOpen(true)}
          >
            {cover ? (
              <img
                className={styles.cover}
                src={cover.url}
                alt="Upload preview"
              />
            ) : (
              <TbFileUpload size={"10rem"} />
            )}
            <ErrorTip
              open={!!errors.coverFile}
              className={styles["cover-error-tip"]}
            >
              {errors.coverFile?.message}
            </ErrorTip>
          </div>
        </div>
        <div className={styles["labeled-field"]}>
          <label htmlFor="artist-name">Name</label>
          <TextField
            className={styles.field}
            id="artist-name"
            type="text"
            placeholder="Enter the name of the artist"
            {...register("name")}
          />
          <ErrorTip
            open={!!errors.name}
            className={styles["field-error-tip"]}
          >
            {errors.name?.message}
          </ErrorTip>
        </div>
        <div className={styles["labeled-field"]}>
          <label htmlFor="artist-type">Type</label>
          <Select.Root
            placeholder="Select artist type"
            onValueChange={(val) => setValue("artistTypeSlug", val)}
          >
            {!artistTypes ? (
              <Select.Item value={"none"}>Loading...</Select.Item>
            ) : (
              artistTypes.map((type) => (
                <Select.Item key={type.slug} value={type.slug}>
                  {type.name}
                </Select.Item>
              ))
            )}
          </Select.Root>
        </div>
        {errors.root && <ErrorMessage>{errors.root.message}</ErrorMessage>}
        <div className={styles["submit-container"]}>
          <Button disabled={isSubmitting}>Create</Button>
        </div>
      </form>
    </>
  );
};

export default CreateArtistForm;
