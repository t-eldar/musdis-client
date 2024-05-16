import styles from "./CreateArtistForm.module.css";

import { ImageUploader } from "@components/file-uploaders/image-uploader";
import { ErrorTip } from "@components/forms/shared/error-tip";
import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { Modal } from "@components/ui/modal";
import { TextField } from "@components/ui/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAlert } from "@hooks/use-alert";
import { useAwait } from "@hooks/use-await";
import { useFetch } from "@hooks/use-fetch";
import { getArtistTypes } from "@services/artist-types";
import { createArtist } from "@services/artists";
import { uploadFile } from "@services/files";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TbFileUpload, TbUsers } from "react-icons/tb";
import { z } from "zod";

import Select from "@components/ui/select";

const formSchema = z.object({
  name: z.string().min(1),
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
  const { data: artistTypes } = useFetch(async (signal) => {
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

  const { promise: invokeCreateArtist, error: createError } =
    useAwait(createArtist);

  const alert = useAlert();

  useEffect(() => {
    if (isAxiosError(createError) && createError.response?.status === 409) {
      setError("name", {
        message: "The artist with this name already exists.",
      });

      return;
    }

    if (createError) {
      setError("root", { message: createError.message });
      alert({
        variant: "warning",
        title: "Error creating artist",
        message: createError.message,
      });
    }
  }, [createError, alert, setError]);

  async function onSubmit(data: FormFields) {
    const result = await invokeCreateArtist(data);

    if (result) {
      onCreated?.();
      alert({
        variant: "success",
        title: "Artist created",
        message: "Your artist has been created successfully",
      });
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

  return (
    <>
      <Modal open={isFileUploaderOpen} onOpenChange={setIsFileUploaderOpen}>
        <ImageUploader
          onSubmit={handleImageSubmit}
          isLoading={isUploadLoading}
          error={uploadError?.message}
        />
      </Modal>
      <Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles["cover-container-wrapper"]}>
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
          <label htmlFor="artist-name">
            <h3>Name</h3>
          </label>
          <div className={styles["field-container"]}>
            <TextField
              id="artist-name"
              type="text"
              placeholder="Enter the name of the artist"
              className={styles.field}
              {...register("name")}
            />
          </div>
          <ErrorTip open={!!errors.name} className={styles["field-error-tip"]}>
            {errors.name?.message}
          </ErrorTip>
        </div>
        <div className={styles["labeled-field"]}>
          <label htmlFor="artist-type">
            <div className={styles.title}>
              <TbUsers />
              <h3>Type</h3>
            </div>
          </label>
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
          <ErrorTip
            open={!!errors.artistTypeSlug}
            className={styles["field-error-tip"]}
          >
            {errors.artistTypeSlug?.message}
          </ErrorTip>
        </div>
        <div className={styles["submit-container"]}>
          <Button disabled={isSubmitting}>Create</Button>
        </div>
      </Form>
    </>
  );
};

export default CreateArtistForm;
