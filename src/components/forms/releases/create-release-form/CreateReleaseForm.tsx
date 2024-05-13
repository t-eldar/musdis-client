import styles from "./CreateReleaseForm.module.css";

import { ImageUploader } from "@components/file-uploaders/image-uploader";
import { TrackRow } from "@components/forms/releases/create-release-form/track-row";
import { ErrorTip } from "@components/forms/shared/error-tip";
import { Button } from "@components/ui/button";
import { Modal } from "@components/ui/modal";
import Select from "@components/ui/select";
import { TextField } from "@components/ui/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAlert } from "@hooks/use-alert";
import { useAwait } from "@hooks/use-await";
import { useReleaseTypes } from "@hooks/use-release-types";
import { useTags } from "@hooks/use-tags";
import { uploadFile } from "@services/files";
import { createRelease } from "@services/releases";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  TbDeviceAudioTape,
  TbFileUpload,
  TbPlus,
  TbTrash,
} from "react-icons/tb";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  releaseTypeSlug: z.string(),
  coverFile: z.object({
    id: z.string().uuid(),
    url: z.string().url(),
  }),
  tracks: z
    .object({
      title: z.string().min(1),
      audioFile: z.object({
        id: z.string().uuid(),
        url: z.string().url(),
      }),
      tagSlugs: z.string().array(),
    })
    .array(),
});

type FormFields = z.infer<typeof formSchema>;

type CreateReleaseFormProps = {
  artist: {
    id: string;
    name: string;
    slug: string;
  };
  onCreated?: () => void;
};

const CreateReleaseForm = ({ artist, onCreated }: CreateReleaseFormProps) => {
  const { promise: invokeCreate, error: createError } = useAwait(createRelease);

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const {
    fields: tracks,
    append: appendTrack,
    remove: removeTrack,
  } = useFieldArray({
    name: "tracks",
    control,
  });

  const [isCoverUploaderOpen, setIsCoverUploaderOpen] = useState(false);

  const alert = useAlert();

  const { tags } = useTags();
  const { releaseTypes } = useReleaseTypes();

  const [cover, setCover] = useState<{ id: string; url: string }>();
  const {
    promise: uploadImage,
    isLoading: isUploadLoading,
    error: uploadError,
  } = useAwait<typeof uploadFile>(uploadFile);

  useEffect(() => {
    if (createError) {
      alert({
        variant: "warning",
        title: "Error creating release",
        message: createError.message,
      });
    }
  }, [createError, alert]);

  async function onSubmit(data: FormFields) {
    const result = await invokeCreate({ ...data, artistIds: [artist.id] });
    if (result) {
      alert({
        variant: "success",
        title: "Release created",
        message: "Your release has been created successfully",
      });

      onCreated?.();
    }
  }
  function checkKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }
  async function handleImageSubmit(file: File) {
    const result = await uploadImage(file);
    if (result) {
      setCover({ id: result.id, url: result.url });
      setValue("coverFile", { id: result.id, url: result.url });
      setIsCoverUploaderOpen(false);
    }
  }

  function handleAddTrack() {
    appendTrack({
      title: "",
      audioFile: undefined! as {
        id: string;
        url: string;
      },
      tagSlugs: [],
    });
  }

  function handleRemoveTrack(index: number) {
    removeTrack(index);
  }

  function handleSetAudioFile(
    index: number,
    file: { id: string; url: string }
  ) {
    setValue(`tracks.${index}.audioFile`, file);
  }

  return (
    <>
      <Modal open={isCoverUploaderOpen} onOpenChange={setIsCoverUploaderOpen}>
        <ImageUploader
          onSubmit={handleImageSubmit}
          isLoading={isUploadLoading}
          error={uploadError?.message}
        />
      </Modal>
      <div className={styles.container}>
        <h1 className={styles.title}>
          <TbDeviceAudioTape /> Create release for {artist?.name}
        </h1>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
          noValidate
        >
          <div className={styles["labeled-field"]}>
            <label>
              <h3>Cover</h3>
            </label>
            <div
              className={styles["cover-container"]}
              onClick={() => setIsCoverUploaderOpen(true)}
            >
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
          <div className={styles["track-list"]}>
            {tracks.map((_, index) => (
              <div className={styles.relative} key={index}>
                <TrackRow
                  keyValue={index}
                  className={styles["track-row"]}
                  tags={tags || []}
                  registerTitle={() => register(`tracks.${index}.title`)}
                  onAudioFileChange={(file) => handleSetAudioFile(index, file)}
                  onSelectedTagsChange={(ts) =>
                    setValue(
                      `tracks.${index}.tagSlugs`,
                      ts?.map((t) => t.slug)
                    )
                  }
                  errors={errors.tracks?.[index]}
                />
                <Button
                  className={styles["remove-button"]}
                  onClick={() => handleRemoveTrack(index)}
                >
                  <TbTrash />
                </Button>
              </div>
            ))}{" "}
            <Button
              className={styles["add-track-button"]}
              onClick={handleAddTrack}
            >
              Add track
              <TbPlus />
            </Button>
          </div>

          <div>
            <Button type="submit" disabled={isSubmitting}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateReleaseForm;
