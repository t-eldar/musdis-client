import styles from "./AudioPlayerOverlay.module.css";

import AudioPlayer from "@components/audio-player";

import { ArtistsLinks } from "@components/artists-links";
import { useAudioStore } from "@stores/audio-store";
import { combineClassNames } from "@utils/style-utils";
import { useEffect, useState } from "react";
import TrackList from "@components/lists/track-list";
import Button from "@components/ui/button";
import { TbChevronDown, TbChevronUp, TbList, TbX } from "react-icons/tb";

type AudioPlayerOverlayProps = {
  onActiveChange?: (isActive: boolean) => void;
};
const AudioPlayerOverlay = ({ onActiveChange }: AudioPlayerOverlayProps) => {
  const playlist = useAudioStore((state) => state.playlist);
  const trackId = useAudioStore((state) => state.currentTrackId);
  const setTrackId = useAudioStore((state) => state.setCurrentTrackId);
  const audioElement = useAudioStore((state) => state.audioElement);

  const [isActive, setIsActive] = useState(false);

  const [tracksShown, setTracksShown] = useState(false);
  const [isShowClicked, setIsShowClicked] = useState(false);

  const [track, setTrack] = useState<{
    title: string;
    audioUrl: string;
    artists: {
      name: string;
      slug: string;
    }[];
    coverUrl: string;
  }>();

  useEffect(() => {
    onActiveChange?.(isActive);
  }, [isActive, onActiveChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (track) {
        setIsActive(true);
        audioElement?.play();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [track, audioElement]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTracksShown(isShowClicked);
    }, 100);

    return () => clearTimeout(timer);
  }, [isShowClicked]);

  useEffect(() => {
    if (playlist && trackId !== null) {
      setTrack(playlist.find((t) => t.id === trackId));
    }
  }, [playlist, trackId]);

  function handleNext() {
    if (!playlist) {
      return;
    }
    const index = playlist.findIndex((t) => t.id === trackId);
    if (index < playlist.length - 1) {
      setTrackId(playlist[index + 1].id);
    } else {
      setTrackId(playlist[0].id);
    }
  }
  function handlePrevious() {
    if (!playlist) {
      return;
    }
    const index = playlist.findIndex((t) => t.id === trackId);
    if (index > 0) {
      setTrackId(playlist[index - 1].id);
    } else {
      setTrackId(playlist[playlist.length - 1].id);
    }
  }

  function handleClose() {
    setIsActive(false);
    audioElement?.pause();
  }

  if (track) {
    return (
      <div
        className={combineClassNames(
          styles["player-overlay"],
          isActive ? styles.active : ""
        )}
      >
        <AudioPlayer.Root
          className={styles.root}
          currentSong={track}
          onNext={handleNext}
          onPrevious={handlePrevious}
        >
          <div className={styles.container}>
            <div className={styles["cover-container"]}>
              <AudioPlayer.Cover className={styles.cover} />
              <div className={styles["info-container"]}>
                <div className={styles.title}>{track.title}</div>
                <ArtistsLinks artists={track.artists} />
              </div>
            </div>
            <div className={styles["controls"]}>
              <AudioPlayer.Controls />
            </div>
            <AudioPlayer.TimeProgress className={styles["time-progress"]} />
            <div className={styles["overlay-display-buttons"]}>
              <Button
                className={styles["overlay-button"]}
                onClick={() => setIsShowClicked((s) => !s)}
              >
                <TbList />
                {tracksShown ? <TbChevronDown /> : <TbChevronUp />}
              </Button>
            </div>
            <div className={styles["progress-bar"]}>
              <AudioPlayer.ProgressBar />
            </div>
          </div>

          {playlist && (
            <div
              className={combineClassNames(
                styles["tracks-container"],
                tracksShown
                  ? styles["tracks-container-visible"]
                  : styles["tracks-container-hidden"]
              )}
            >
              <div className={styles.tracks}>
                <TrackList tracks={playlist} />
              </div>
            </div>
          )}
          <Button className={styles["close-button"]} onClick={handleClose}>
            <TbX />
          </Button>
        </AudioPlayer.Root>
      </div>
    );
  }
};

export default AudioPlayerOverlay;
