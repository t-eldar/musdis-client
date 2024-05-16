import styles from "./UpdateReleaseForm.module.css";

import { ImageUploader } from "@components/file-uploaders/image-uploader";
import { ErrorTip } from "@components/forms/shared/error-tip";
import Button from "@components/ui/button";
import Form from "@components/ui/form";
import { Modal } from "@components/ui/modal";
import Select from "@components/ui/select";
import { TextField } from "@components/ui/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAlert } from "@hooks/use-alert";
import { useAwait } from "@hooks/use-await";
import { useReleaseTypes } from "@hooks/use-release-types";
import { uploadFile } from "@services/files";
import { deleteRelease, updateRelease } from "@services/releases";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TbCheck, TbFileUpload, TbTrash } from "react-icons/tb";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1).optional(),
  releaseTypeSlug: z.string().optional(),
  coverFile: z
    .object({
      id: z.string().uuid(),
      url: z.string().url(),
    })
    .optional(),
});

type FormFields = z.infer<typeof formSchema>;

type UpdateReleaseFormProps = {
  release: {
    id: string;
    name: string;
    releaseTypeSlug: string;
    coverUrl: string;
  };
  onUpdated?: () => void;
  onDeleted?: () => void;
};

const UpdateReleaseForm = ({
  release,
  onUpdated,
  onDeleted,
}: UpdateReleaseFormProps) => {
  const { promise: invokeUpdate, error: updateError } = useAwait(updateRelease);

  const {
    handleSubmit,
    register,
    setValue,

    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: release.name,
    },
    resolver: zodResolver(formSchema),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalType, setModalType] = useState<"cover" | "delete">("cover");

  const alert = useAlert();
  const { releaseTypes } = useReleaseTypes();

  const [cover, setCover] = useState<{ id: string; url: string }>({
    id: "",
    url: release.coverUrl,
  });
  const {
    promise: uploadImage,
    isLoading: isUploadLoading,
    error: uploadError,
  } = useAwait<typeof uploadFile>(uploadFile);

  const { promise: invokeDelete } = useAwait(deleteRelease);

  useEffect(() => {
    if (updateError) {
      alert({
        variant: "warning",
        title: "Error creating release",
        message: updateError.message,
      });
    }
  }, [updateError, alert]);

  async function onSubmit(data: FormFields) {
    const result = await invokeUpdate(release.id, data);
    if (result === "success") {
      alert({
        variant: "success",
        title: "Release created",
        message: "Your release has been created successfully",
      });

      onUpdated?.();
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

  function handleCoverClick() {
    setModalType("cover");
    setIsModalOpen(true);
  }

  function handleDeleteClick() {
    setModalType("delete");
    setIsModalOpen(true);
  }

  async function handleDelete() {
    await invokeDelete(release.id);
    setIsModalOpen(false);

    onDeleted?.();
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
            <h3>Are you sure you want to delete this release?</h3>
            <div className={styles["button-container"]}>
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
      <Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles["left-section"]}>
          <div className={styles["cover-container"]} onClick={handleCoverClick}>
            {cover ? (
              <img
                className={styles.cover}
                src={cover.url}
                alt="Upload preview"
              />
            ) : (
              <TbFileUpload size={"4rem"} />
            )}
          </div>
          <ErrorTip
            open={!!errors.coverFile}
            className={styles["cover-error-tip"]}
          >
            {errors.coverFile?.message}
          </ErrorTip>
        </div>
        <div className={styles["right-section"]}>
          <div className={styles["fields-container"]}>
            <div className={styles["labeled-field"]}>
              <label htmlFor="release-name">
                <h3>Name</h3>
              </label>
              <TextField
                className={styles["name-field"]}
                id="release-name"
                type="text"
                placeholder="Enter the name of the release"
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
              <label>
                <h3>Type</h3>
              </label>
              <Select.Root
                placeholder="Choose a release type"
                onValueChange={(val) => setValue("releaseTypeSlug", val)}
                defaultValue={release.releaseTypeSlug}
              >
                {!releaseTypes ? (
                  <Select.Item value={"none"}>Loading...</Select.Item>
                ) : (
                  releaseTypes.map((type) => (
                    <Select.Item key={type.slug} value={type.slug}>
                      {type.name}
                    </Select.Item>
                  ))
                )}
              </Select.Root>
              <ErrorTip
                open={!!errors.releaseTypeSlug}
                className={styles["field-error-tip"]}
              >
                {errors.releaseTypeSlug?.message}
              </ErrorTip>
            </div>
          </div>
          <div className={styles["button-container"]}>
            <Button
              className={styles["delete-button"]}
              onClick={handleDeleteClick}
            >
              <TbTrash />
              Delete
            </Button>
            <Button
              type="submit"
              className={styles["submit-button"]}
              disabled={isSubmitting}
            >
              <TbCheck />
              Update
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default UpdateReleaseForm;
