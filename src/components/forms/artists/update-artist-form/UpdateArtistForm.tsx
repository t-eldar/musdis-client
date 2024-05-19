import styles from "./UpdateArtistForm.module.css";

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
import { deleteArtist, updateArtist } from "@services/artists";
import { uploadFile } from "@services/files";
import { isAxiosError } from "axios";
import { ComponentProps, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TbFileUpload, TbUsers } from "react-icons/tb";
import { z } from "zod";

import Select from "@components/ui/select";
import useCanEdit from "@hooks/use-can-edit";

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

type CreateArtistFormProps = ComponentProps<"div"> & {
  artist: {
    id: string;
    name: string;
    artistTypeSlug: string;
    coverUrl: string;
    creatorId: string;
  };
  onUpdated?: () => void;
  onDeleted?: () => void;
};

const UpdateArtistForm = ({
  onUpdated,
  onDeleted,
  artist,
  ...rest
}: CreateArtistFormProps) => {
  const canEdit = useCanEdit(artist);

  const alert = useAlert();

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"cover" | "delete">("cover");
  const [cover, setCover] = useState<{ id: string; url: string }>({
    id: "",
    url: artist.coverUrl,
  });
  const {
    promise: uploadImage,
    isLoading: isUploadLoading,
    error: uploadError,
  } = useAwait<typeof uploadFile>(uploadFile);

  const { promise: invokeUpdateArtist, error: updateError } =
    useAwait(updateArtist);

  const { promise: invokeDeleteArtist, error: deleteError } =
    useAwait(deleteArtist);

  useEffect(() => {
    if (isAxiosError(updateError) && updateError.response?.status === 409) {
      setError("name", {
        message: "The artist with this name already exists.",
      });

      return;
    }

    if (updateError) {
      setError("root", { message: updateError.message });
      alert({
        variant: "warning",
        title: "Error creating artist",
        message: updateError.message,
      });
    }
  }, [updateError, alert, setError]);

  async function onSubmit(data: FormFields) {
    const result = await invokeUpdateArtist(artist.id, data);

    if (result === "success") {
      onUpdated?.();
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
      setIsModalOpen(false);
    }
  }

  async function handleDelete() {
    const result = await invokeDeleteArtist(artist.id);
    if (result === "success") {
      alert({
        variant: "success",
        title: "Artist deleted",
        message: "Your artist has been deleted successfully",
      });

      onDeleted?.();
    }
  }

  function handleDeleteClick() {
    setModalType("delete");
    setIsModalOpen(true);
  }

  function handleUploadClick() {
    setModalType("cover");
    setIsModalOpen(true);
  }

  if (canEdit === false) {
    alert({
      variant: "warning",
      title: "Permission denied",
      message: "You do not have permission to edit this artist",
    });

    return <></>;
  }

  return (
    <>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        {modalType === "cover" ? (
          <ImageUploader
            onSubmit={handleImageSubmit}
            isLoading={isUploadLoading}
            error={uploadError?.message}
          />
        ) : modalType === "delete" ? (
          <div className={styles["ensure-delete-container"]}>
            <p>Are you sure you want to delete this artist?</p>
            <div className={styles["submit-container"]}>
              <Button
                className={styles["delete-button"]}
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            </div>
          </div>
        ) : null}
      </Modal>
      <div {...rest}>
        <Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles["cover-container-wrapper"]}>
            <div
              className={styles["cover-container"]}
              onClick={handleUploadClick}
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
            <ErrorTip
              open={!!errors.name}
              className={styles["field-error-tip"]}
            >
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
            <Button
              onClick={handleDeleteClick}
              className={styles["delete-button"]}
            >
              Delete
            </Button>
            <Button disabled={isSubmitting}>Update</Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default UpdateArtistForm;
