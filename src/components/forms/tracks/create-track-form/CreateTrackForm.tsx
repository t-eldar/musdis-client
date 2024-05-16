import styles from "./CreateTrackForm.module.css";

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
import { createTrack } from "@services/tracks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TbFileMusic, TbMinus, TbPlus } from "react-icons/tb";
import { z } from "zod";

const formSchema = z.object({
  releaseId: z.string().uuid(),
  title: z.string().min(1),
  audioFile: z.object({
    id: z.string().uuid(),
    url: z.string().url(),
  }),
  tagSlugs: z.string().array(),
  artistIds: z.string().array(),
});

type FormFields = z.infer<typeof formSchema>;

type CreateTrackFormProps = {
  className?: string;
  releaseId: string;
  tags: {
    name: string;
    slug: string;
  }[];
  onCreated?: () => void;
};
const CreateTrackForm = ({
  releaseId,
  tags,
  onCreated,
  className,
}: CreateTrackFormProps) => {
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      releaseId,
      artistIds: [],
    },
    resolver: zodResolver(formSchema),
  });

  const [fileName, setFileName] = useState("");

  const [selectedTags, setSelectedTags] = useState<
    {
      name: string;
      slug: string;
    }[]
  >([]);

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const { promise: upload, error: uploadError } = useAwait(
    async (file: File) => {
      return await uploadFile(file);
    }
  );

  const { promise: invokeCreateTrack, error: createError } =
    useAwait(createTrack);

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
    const result = await invokeCreateTrack(data);
    if (result) {
      alert({
        variant: "success",
        title: "Track created",
        message: "Your track has been created successfully",
      });
      onCreated?.();
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
                  onClick={() => handleRemoveTag(tag)}
                >
                  <TbMinus />
                </Button>
              </div>
            ))}
            <Button
              className={styles["tag-button"]}
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
              Choose file
            </Button>
            {fileName || "File is not chosen yet."}
          </div>
          <ErrorTip
            open={!!errors?.audioFile}
            className={styles["field-error-tip"]}
          >
            {errors?.audioFile?.message}
          </ErrorTip>
        </div>
        <Button type="submit">Create</Button>
      </Form>
    </div>
  );
};

export default CreateTrackForm;
