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
import { PiVinylRecordFill } from "react-icons/pi";
import { TbMinus, TbPlus } from "react-icons/tb";

type TrackRowProps = {
  tags: { name: string; slug: string }[];
  keyValue: string;
  onTrackChange: (
    key: string,
    track: {
      title: string;
      audioFile: {
        id: string;
        url: string;
      };
      tagSlugs: string[];
    }
  ) => void;
  className?: string;
};

const TrackRow = ({
  keyValue,
  onTrackChange,
  tags,
  className,
}: TrackRowProps) => {
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [audioFile, setAudioFile] = useState<{
    id: string;
    url: string;
  }>();
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
    if (audioFile && title && selectedTags) {
      onTrackChange(keyValue, {
        title,
        audioFile,
        tagSlugs: selectedTags.map((t) => t.slug),
      });
    }
  }, [audioFile, title, onTrackChange, selectedTags, keyValue]);

  async function handleFileSubmit(file: File) {
    const result = await upload(file);
    if (result) {
      setIsFileModalOpen(false);
      setAudioFile(result);
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
          <h2>Title</h2>
        </label>
        <TextField
          id={`track-title-${keyValue}`}
          type="text"
          value={title}
          className={styles["name-field"]}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the title of the track"
        />
      </div>
      <div className={styles["labeled-field"]}>
        <h2>Tags</h2>
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
        <h2>File</h2>
        <div className={styles["select-file"]}>
          <Button
            className={styles.button}
            onClick={() => setIsFileModalOpen(true)}
          >
            <PiVinylRecordFill />
            {audioFile ? "Change file" : "Choose file"}
          </Button>
          {fileName || "File is not chosen yet."}
        </div>
      </div>
    </div>
  );
};

export default TrackRow;
