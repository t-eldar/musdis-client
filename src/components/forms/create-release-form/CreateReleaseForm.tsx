import styles from "./CreateReleaseForm.module.css";

import { ImageUploader } from "@components/file-uploaders/image-uploader";
import { TrackRow } from "@components/forms/create-release-form/track-row";
import { ErrorTip } from "@components/forms/shared/error-tip";
import { Button } from "@components/ui/button";
import { Modal } from "@components/ui/modal";
import { TextField } from "@components/ui/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAwait } from "@hooks/use-await";
import { useTags } from "@hooks/use-tags";
import { uploadFile } from "@services/files";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TbFileUpload, TbPlus, TbTrash } from "react-icons/tb";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  releaseTypeSlug: z.string(),
  coverFile: z.object({
    id: z.string().uuid(),
    url: z.string().url(),
  }),
  // artistIds: z.string().uuid().array(),
  tracks: z
    .object({
      title: z.string(),
      audioFile: z.object({
        id: z.string().uuid(),
        url: z.string().url(),
      }),
      tagSlugs: z.string().array(),
    })
    .array(),
});

type FormFields = z.infer<typeof formSchema>;

const CreateReleaseForm = () => {
  const {
    handleSubmit,
    register,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const [isCoverUploaderOpen, setIsCoverUploaderOpen] = useState(false);
  const [tracks, setTracks] = useState<
    Record<
      string,
      {
        title: string;
        audioFile: {
          id: string;
          url: string;
        };
        tagSlugs: string[];
      }
    >
  >();

  const { tags } = useTags();

  const [cover, setCover] = useState<{ id: string; url: string }>();
  const {
    promise: uploadImage,
    isLoading: isUploadLoading,
    error: uploadError,
  } = useAwait<typeof uploadFile>(uploadFile);

  const onSubmit: SubmitHandler<FormFields> = (data) => {};
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

  const handleTrackChange = useCallback(
    (
      key: string,
      track: {
        title: string;
        audioFile: {
          id: string;
          url: string;
        };
        tagSlugs: string[];
      }
    ) => {
      console.log(tracks);

      setTracks({
        ...tracks,
        [key]: track,
      });
    },
    []
  );

  function handleAddTrack() {
    const array = Object.keys(tracks || {}).map((key) => tracks?.[key]);

    setTracks({
      ...tracks,
      [array.length]: {
        title: "",
        audioFile: { id: "", url: "" },
        tagSlugs: [],
      },
    });
  }

  function handleRemoveTrack(key: string) {
    if (!tracks) {
      return;
    }

    const { [key]: _, ...rest } = tracks;
    setTracks({ ...rest });
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
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => checkKeyDown(e)}
        noValidate
      >
        <div className={styles["labeled-field"]}>
          <h1 className={styles.title}>Cover</h1>
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
            <h1>Name</h1>
          </label>
          <TextField
            className={styles["name-field"]}
            id="artist-name"
            type="text"
            placeholder="Enter the name of the release"
            {...register("name")}
          />
        </div>
        {tracks &&
          Object.keys(tracks)
            .map((key) => {
              return { key, value: tracks[key] };
            })
            .map((track) => (
              <div className={styles.relative} key={track.key}>
                <TrackRow
                  keyValue={track.key}
                  className={styles["track-row"]}
                  onTrackChange={handleTrackChange}
                  tags={tags || []}
                />
                <Button
                  className={styles["remove-button"]}
                  onClick={() => handleRemoveTrack(track.key.toString())}
                >
                  <TbTrash />
                </Button>
              </div>
            ))}{" "}
        <Button className={styles["add-track-button"]} onClick={handleAddTrack}>
          Add track
          <TbPlus />
        </Button>
      </form>
    </>
  );
};

export default CreateReleaseForm;
