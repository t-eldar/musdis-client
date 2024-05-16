import styles from "./AudioPlayerOverlay.module.css";

import AudioPlayer from "@components/audio-player";

import { ArtistsLinks } from "@components/artists-links";
import { useAudioStore } from "@stores/audio-store";
import { combineClassNames } from "@utils/style-utils";
import { useEffect, useState } from "react";

type AudioPlayerOverlayProps = {
  onActiveChange?: (isActive: boolean) => void;
};
const AudioPlayerOverlay = ({ onActiveChange }: AudioPlayerOverlayProps) => {
  const playlist = useAudioStore((state) => state.playlist);
  const trackId = useAudioStore((state) => state.currentTrackId);
  const setTrackId = useAudioStore((state) => state.setCurrentTrackId);
  const audioElement = useAudioStore((state) => state.audioElement);

  const [isActive, setIsActive] = useState(false);

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

  if (track) {
    return (
      <div
        className={combineClassNames(
          styles["player-overlay"],
          isActive ? styles.active : ""
        )}
      >
        <AudioPlayer.Root
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
            <div className={styles["controls-container"]}>
              <AudioPlayer.Controls />
              <AudioPlayer.ProgressBar />
            </div>
            <AudioPlayer.TimeProgress className={styles["time-progress"]} />
          </div>
        </AudioPlayer.Root>
      </div>
    );
  }
};

export default AudioPlayerOverlay;
