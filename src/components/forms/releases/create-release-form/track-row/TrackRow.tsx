import { ErrorTip } from "@components/forms/shared/error-tip";
import styles from "./TrackRow.module.css";

import { AudioUploader } from "@components/file-uploaders/audio-uploader";
import TagList from "@components/lists/tag-list";
import { Button } from "@components/ui/button";
import { Modal } from "@components/ui/modal";
import { TextField } from "@components/ui/text-field";
import { useAwait } from "@hooks/use-await";
import { uploadFile } from "@services/files";
import { combineClassNames } from "@utils/style-utils";
import { useEffect, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { TbFileMusic, TbMinus, TbPlus } from "react-icons/tb";

type TrackRowProps = {
  tags: { name: string; slug: string }[];
  keyValue: number;
  onAudioFileChange: (file: { id: string; url: string }) => void;
  errors?: {
    title?: { message?: string };
    audioFile?: { message?: string };
  };

  onSelectedTagsChange: (tags: { name: string; slug: string }[]) => void;
  registerTitle: () => UseFormRegisterReturn<`tracks.${number}.title`>;
  className?: string;
};

const TrackRow = ({
  keyValue,
  onAudioFileChange,
  onSelectedTagsChange,
  tags,
  errors,
  className,
  registerTitle,
}: TrackRowProps) => {
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

  useEffect(() => {
    onSelectedTagsChange(selectedTags);
  }, [selectedTags, onSelectedTagsChange]);

  async function handleFileSubmit(file: File) {
    const result = await upload(file);
    if (result) {
      setIsFileModalOpen(false);
      onAudioFileChange(result);
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

  return (
    <div className={combineClassNames(styles.container, className)}>
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
      <div className={styles["labeled-field"]}>
        <label htmlFor={`track-title-${keyValue}`}>
          <h3>Title</h3>
        </label>
        <TextField
          id={`track-title-${keyValue}`}
          type="text"
          {...registerTitle()}
          // value={title}
          className={styles["name-field"]}
          // onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the title of the track"
        />
        <ErrorTip open={!!errors?.title} className={styles["field-error-tip"]}>
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
    </div>
  );
};

export default TrackRow;
