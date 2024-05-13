import styles from "./UpdateArtistForm.module.css";

import { ImageUploader } from "@components/file-uploaders/image-uploader";
import ErrorTip from "@components/forms/shared/error-tip";
import { Button } from "@components/ui/button";
import { Modal } from "@components/ui/modal";
import Select from "@components/ui/select";
import { TextField } from "@components/ui/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import useAlert from "@hooks/use-alert";
import { useAwait } from "@hooks/use-await";
import { useFetch } from "@hooks/use-fetch";
import { getArtistTypes } from "@services/artist-types";
import { updateArtist } from "@services/artists";
import { uploadFile } from "@services/files";
import { useAuthStore } from "@stores/auth-store";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TbFileUpload, TbUsers } from "react-icons/tb";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1).optional(),
  artistTypeSlug: z.string().optional(),
  coverFile: z
    .object(
      {
        id: z.string().uuid(),
        url: z.string().url(),
      },
      {
        required_error: "Please upload a cover image.",
      }
    )
    .optional(),
  userIds: z.string().uuid().array().optional(),
});
type FormFields = z.infer<typeof formSchema>;

type CreateArtistFormProps = {
  artist: {
    id: string;
    name: string;
    artistTypeSlug: string;
    coverUrl: string;
    creatorId: string;
  };
  onCreated?: () => void;
};

const UpdateArtistForm = ({ onCreated, artist }: CreateArtistFormProps) => {
  const user = useAuthStore((s) => s.user);

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
    defaultValues: {
      name: artist.name,
      artistTypeSlug: artist.artistTypeSlug,
      userIds: undefined,
    },
    resolver: zodResolver(formSchema),
  });

  const [isFileUploaderOpen, setIsFileUploaderOpen] = useState(false);
  const [cover, setCover] = useState<{ id: string; url: string }>({
    id: "",
    url: artist.coverUrl,
  });
  const {
    promise: uploadImage,
    isLoading: isUploadLoading,
    error: uploadError,
  } = useAwait<typeof uploadFile>(uploadFile);

  const { promise: invokeUpdateArtist, error: createError } =
    useAwait(updateArtist);

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
    const result = await invokeUpdateArtist(artist.id, data);

    if (result === "success") {
      onCreated?.();
      alert({
        variant: "success",
        title: "Artist created",
        message: "Your artist has been updated successfully",
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

  function checkKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  if (user === null || (user && user.id !== artist.creatorId)) {
    return <h1> you have no access </h1>;
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
            defaultValue={artist.artistTypeSlug}
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
          <Button disabled={isSubmitting}>Update</Button>
        </div>
      </form>
    </>
  );
};

export default UpdateArtistForm;
