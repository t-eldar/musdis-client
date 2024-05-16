import styles from "./UpdatableTrackList.module.css";

import { CreateTrackForm } from "@components/forms/tracks/create-track-form";
import UpdateTrackForm from "@components/forms/tracks/update-track-form";
import { Button } from "@components/ui/button";
import { Modal } from "@components/ui/modal";
import useAwait from "@hooks/use-await";
import useTags from "@hooks/use-tags";
import { deleteTrack } from "@services/tracks";
import { useState } from "react";
import { TbPencil, TbPlus, TbTrash } from "react-icons/tb";

type UpdatableTrackListProps = {
  tracks: {
    id: string;
    slug: string;
    title: string;
    coverUrl: string;
    artists: {
      slug: string;
      name: string;
    }[];
    tags: {
      slug: string;
      name: string;
    }[];
  }[];
  releaseId: string;
  onChanged: () => void;
};

const UpdatableTrackList = ({
  tracks,
  releaseId,
  onChanged,
}: UpdatableTrackListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalType, setModalType] = useState<"create" | "update" | "delete">(
    "create"
  );

  const [trackToUpdate, setTrackToUpdate] = useState<{
    id: string;
    title: string;
    tags: {
      slug: string;
      name: string;
    }[];
  }>();

  const [trackToDeleteId, setTrackToDeleteId] = useState<string>();

  const { promise: invokeDelete } = useAwait(deleteTrack);

  const { tags } = useTags();

  function handleSelectTrackToUpdate(track: {
    id: string;
    title: string;
    tags: {
      slug: string;
      name: string;
    }[];
  }) {
    setTrackToUpdate(track);
    setModalType("update");
    setIsModalOpen(true);
  }

  function handleAddTrack() {
    setModalType("create");

    setIsModalOpen(true);
  }

  function handleCreated() {
    setIsModalOpen(false);
    onChanged?.();
  }

  function handleUpdated() {
    setIsModalOpen(false);
    onChanged?.();
  }

  function handleDeleteOpen(trackId: string) {
    setTrackToDeleteId(trackId);
    setModalType("delete");
    setIsModalOpen(true);
  }

  async function handleDelete() {
    if (trackToDeleteId) {
      await invokeDelete(trackToDeleteId);
      onChanged?.();
      setIsModalOpen(false);
    }
  }

  return (
    <div>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        {tags &&
          (modalType === "create" ? (
            <CreateTrackForm
              className={styles.form}
              releaseId={releaseId}
              tags={tags}
              onCreated={handleCreated}
            />
          ) : modalType === "update" ? (
            trackToUpdate && (
              <UpdateTrackForm
                className={styles.form}
                tags={tags}
                track={trackToUpdate}
                onUpdated={handleUpdated}
              />
            )
          ) : modalType === "delete" ? (
            <div className={styles["delete-container"]}>
              <h3>Are you sure you want to delete this track?</h3>
              <div className={styles["button-container"]}>
                <Button
                  className={styles["ensure-delete-button"]}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button
                  className={styles["cancel-delete-button"]}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : null)}
      </Modal>

      <ul className={styles.list}>
        {tracks.map((t) => (
          <li key={t.slug} className={styles.item}>
            <div className={styles["track-metadata"]}>
              <h2>{t.title}</h2>
              {t.artists.map((a) => (
                <span key={a.slug}>{a.name}</span>
              ))}
            </div>
            <div className={styles["tag-container"]}>
              {t.tags.map((tag) => (
                <span key={tag.slug} className={styles.tag}>
                  {tag.name}
                </span>
              ))}
            </div>
            <div>
              <Button
                className={styles["edit-button"]}
                onClick={() => handleSelectTrackToUpdate(t)}
              >
                <TbPencil />
              </Button>
              <Button
                className={styles["delete-button"]}
                onClick={() => handleDeleteOpen(t.id)}
              >
                <TbTrash />
              </Button>
            </div>
          </li>
        ))}
        <Button className={styles["add-track-button"]} onClick={handleAddTrack}>
          Add track
          <TbPlus />
        </Button>
      </ul>
    </div>
  );
};

export default UpdatableTrackList;
