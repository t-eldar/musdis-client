import { useAuthStore } from "@stores/auth-store";
import styles from "./ProfilePage.module.css";

import * as Avatar from "@radix-ui/react-avatar";
import Modal from "@components/ui/modal";
import { useState } from "react";
import ImageUploader from "@components/file-uploaders/image-uploader";
import { uploadFile } from "@services/files";
import { useAwait } from "@hooks/use-await";
import { getUserInfo, updateUser } from "@services/authentication";
import ReleaseList from "@components/lists/release-list";
import useFetch from "@hooks/use-fetch";
import { getUserReleases } from "@services/releases";
import ArtistList from "@components/lists/artist-list";
import { getUserArtists } from "@services/artists";
import {
  TbDeviceAudioTape,
  TbMusic,
  TbPencil,
  TbWaveSquare,
} from "react-icons/tb";
import { combineClassNames } from "@utils/style-utils";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditHover, setIsEditHover] = useState(false);

  const { promise: uploadImage, error: uploadError } =
    useAwait<typeof uploadFile>(uploadFile);

  const { promise: editProfile, error: editError } = useAwait(updateUser);
  const { promise: getUser, error: userError } = useAwait(getUserInfo);

  const {
    data: releases,
    error: releasesError,
    isLoading: releasesLoading,
  } = useFetch(
    async (signal) => {
      return await getUserReleases(user?.id || "", signal);
    },
    [user]
  );

  const {
    data: artists,
    error: artistsError,
    isLoading: artistsLoading,
  } = useFetch(
    async (signal) => {
      return await getUserArtists(user?.id || "", signal);
    },
    [user]
  );

  async function handleImageSubmit(file: File) {
    const result = await uploadImage(file);
    if (result) {
      await editProfile({ avatarFile: result });
      const userInfo = await getUser();
      if (userInfo) {
        setUser(userInfo);
      }

      setIsModalOpen(false);
    }
  }

  return (
    <>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ImageUploader
          error={uploadError?.message || editError?.message}
          onSubmit={handleImageSubmit}
        />
      </Modal>
      <div className={styles.container}>
        <div className={styles["user-info"]}>
          <div className={styles.relative}>
            <Avatar.Root
              className={styles["avatar-root"]}
              onClick={() => setIsModalOpen(true)}
              onMouseEnter={() => setIsEditHover(true)}
              onMouseLeave={() => setIsEditHover(false)}
            >
              <Avatar.Image
                className={styles["avatar-image"]}
                src={user?.avatarUrl || undefined}
                alt="Avatar"
              />
              <Avatar.Fallback className={styles["avatar-fallback"]}>
                {user?.userName.charAt(0).toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
            <div
              className={combineClassNames(
                styles["edit-button"],
                isEditHover ? styles["edit-button-active"] : ""
              )}
            >
              <TbPencil />
            </div>
          </div>

          <div className={styles["name-container"]}>
            <h1>{user?.userName}</h1>
            <span>{user?.email}</span>
          </div>

          <div className={styles["releases-info-container"]}>
            <TbMusic size={"2rem"} />
            <h2>{releases?.length || 0} Releases</h2>
          </div>
        </div>
        <div className={styles["list-container"]}>
          <div className={styles["artists"]}>
            <div className={styles["list-info"]}>
              <TbWaveSquare size={"2rem"} />
              <h2>User artists</h2>
            </div>
            {artists && <ArtistList artists={artists} />}
          </div>
          <div className={styles.releases}>
            <div className={styles["list-info"]}>
              <TbDeviceAudioTape size={"2rem"} />
              <h2>User releases</h2>
            </div>
            {releases && <ReleaseList releases={releases} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
