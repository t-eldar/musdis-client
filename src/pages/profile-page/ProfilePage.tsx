import { useAuthStore } from "@stores/auth-store";
import styles from "./ProfilePage.module.css";

import { ImageUploader } from "@components/file-uploaders/image-uploader";
import { ArtistList } from "@components/lists/artist-list";
import { ReleaseList } from "@components/lists/release-list";
import { Modal } from "@components/ui/modal";
import { useAwait } from "@hooks/use-await";
import { useFetch } from "@hooks/use-fetch";
import { getUserArtists } from "@services/artists";
import { getUserInfo, updateUser } from "@services/authentication";
import { uploadFile } from "@services/files";
import { getUserReleases } from "@services/releases";
import { combineClassNames } from "@utils/style-utils";
import { useState } from "react";
import {
  TbDeviceAudioTape,
  TbMusic,
  TbPencil,
  TbWaveSquare,
} from "react-icons/tb";

import { Loader } from "@components/loaders/loader";
import Button from "@components/ui/button";
import * as Avatar from "@radix-ui/react-avatar";
import { FaGuitar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Separator from "@components/ui/separator";
import Footer from "@components/footer";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditHover, setIsEditHover] = useState(false);

  const navigate = useNavigate();

  const { promise: uploadImage, error: uploadError } =
    useAwait<typeof uploadFile>(uploadFile);

  const { promise: editProfile, error: editError } = useAwait(updateUser);
  const { promise: getUser } = useAwait(getUserInfo);

  const { data: releases } = useFetch(
    async (signal) => {
      return await getUserReleases(user?.id || "", signal);
    },
    [user]
  );

  const { data: artists, isLoading: isArtistsLoading } = useFetch(
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

  function handleCreateArtistClick() {
    navigate("/musicians/create-musician");
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
          <div className={styles["list-content"]}>
            {isArtistsLoading ? (
              <Loader />
            ) : artists && artists.length === 0 ? (
              <div className={styles["no-artists-container"]}>
                <Button
                  className={styles["create-artist-button-big"]}
                  onClick={handleCreateArtistClick}
                >
                  <FaGuitar />
                  Add your first musician
                </Button>
              </div>
            ) : (
              <>
                <div className={styles["list-info"]}>
                  <TbWaveSquare size={"2rem"} />
                  <h2 className={styles.title}>your musicians</h2>
                  <Button
                    className={styles["create-artist-button"]}
                    onClick={handleCreateArtistClick}
                  >
                    <FaGuitar />
                    Add new musician
                  </Button>
                </div>
                {artists && (
                  <div className={styles["list-content"]}>
                    <ArtistList artists={artists} />
                  </div>
                )}
              </>
            )}
          </div>
          {releases && releases.length !== 0 && (
            <div className={styles["list-content"]}>
              <div className={styles["list-info"]}>
                <TbDeviceAudioTape size={"2rem"} />
                <h2 className={styles.title}>your releases</h2>
              </div>
              <ReleaseList releases={releases} />
            </div>
          )}
        </div>
        <Separator />
        <Footer />
      </div>
    </>
  );
};

export default ProfilePage;
