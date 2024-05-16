import styles from "./UpdateTrackForm.module.css";

import { AudioUploader } from "@components/file-uploaders/audio-uploader";
import { ErrorTip } from "@components/forms/shared/error-tip";
import { TagList } from "@components/lists/tag-list";
import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { Modal } from "@components/ui/modal";
import { TextField } from "@components/ui/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import useAlert from "@hooks/use-alert";
import { useAwait } from "@hooks/use-await";
import { uploadFile } from "@services/files";
import { updateTrack } from "@services/tracks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TbFileMusic, TbMinus, TbPlus } from "react-icons/tb";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1).optional(),
  audioFile: z
    .object({
      id: z.string().uuid(),
      url: z.string().url(),
    })
    .optional(),
  tagSlugs: z.string().array().optional(),
});

type FormFields = z.infer<typeof formSchema>;

type UpdateTrackFormProps = {
  className?: string;
  track: {
    id: string;
    title: string;
    tags: {
      name: string;
      slug: string;
    }[];
  };
  tags: {
    name: string;
    slug: string;
  }[];
  onUpdated?: () => void;
};
const UpdateTrackForm = ({
  className,
  track,
  tags,
  onUpdated,
}: UpdateTrackFormProps) => {
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      title: track.title,
      tagSlugs: track.tags.map((t) => t.slug),
    },
    resolver: zodResolver(formSchema),
  });

  const [fileName, setFileName] = useState("");

  const [selectedTags, setSelectedTags] = useState<
    {
      name: string;
      slug: string;
    }[]
  >(track.tags);

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const { promise: upload, error: uploadError } = useAwait(
    async (file: File) => {
      return await uploadFile(file);
    }
  );

  const { promise: invokeUpdateTrack, error: createError } =
    useAwait(updateTrack);

  const alert = useAlert();

  useEffect(() => {
    if (createError) {
      alert({
        variant: "warning",
        title: "Something went wrong",
        message: createError.message,
      });
    }
  }, [createError, alert]);

  useEffect(() => {
    setValue(
      "tagSlugs",
      selectedTags.map((t) => t.slug)
    );
  }, [selectedTags, setValue]);

  async function handleFileSubmit(file: File) {
    const result = await upload(file);
    if (result) {
      setValue("audioFile", result);
      setIsFileModalOpen(false);
    }
  }

  function handleTagClick(tag: { name: string; slug: string }) {
    if (selectedTags.some((t) => t.slug === tag.slug)) {
      return;
    }
    setSelectedTags([...selectedTags, tag]);

    setIsTagModalOpen(false);
  }

  function handleRemoveTag(tag: { name: string; slug: string }) {
    setSelectedTags(selectedTags.filter((t) => t.slug !== tag.slug));
  }

  async function onSubmit(data: FormFields) {
    const result = await invokeUpdateTrack(track.id, data);
    console.log(result);

    if (result) {
      onUpdated?.();
    }
  }

  return (
    <div className={className}>
      <Modal open={isFileModalOpen} onOpenChange={setIsFileModalOpen}>
        <AudioUploader
          onFileNameChange={setFileName}
          onSubmit={handleFileSubmit}
          error={uploadError?.message}
        />
      </Modal>
      <Modal open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
        <TagList
          className={styles["tag-list"]}
          tags={tags}
          onTagClick={handleTagClick}
        />
      </Modal>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles["labeled-field"]}>
          <label htmlFor="track-title">
            <h3>Title</h3>
          </label>
          <TextField
            id="track-title"
            type="text"
            {...register("title")}
            className={styles["name-field"]}
            placeholder="Enter the title of the track"
          />
          <ErrorTip
            open={!!errors?.title}
            className={styles["field-error-tip"]}
          >
            {errors?.title?.message}
          </ErrorTip>
        </div>
        <div className={styles["labeled-field"]}>
          <label>
            <h3>Tags</h3>
          </label>
          <div className={styles["selected-tag-list"]}>
            {selectedTags.map((tag) => (
              <div key={tag.slug} className={styles["selected-tag"]}>
                {tag.name}
                <Button
                  className={styles["remove-button"]}
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <TbMinus />
                </Button>
              </div>
            ))}
            <Button
              className={styles["tag-button"]}
              type="button"
              onClick={() => setIsTagModalOpen(true)}
            >
              Add tag
              <TbPlus />
            </Button>
          </div>
        </div>
        <div className={styles["labeled-field"]}>
          <label>
            <h3>File</h3>
          </label>
          <div className={styles["select-file"]}>
            <Button
              className={styles.button}
              onClick={() => setIsFileModalOpen(true)}
            >
              <TbFileMusic />
              Change file
            </Button>
            {fileName || ""}
          </div>
          <ErrorTip
            open={!!errors?.audioFile}
            className={styles["field-error-tip"]}
          >
            {errors?.audioFile?.message}
          </ErrorTip>
        </div>
        <Button type="submit">Update</Button>
      </Form>
    </div>
  );
};

export default UpdateTrackForm;
