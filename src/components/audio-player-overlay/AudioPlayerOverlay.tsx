import styles from "./AudioPlayerOverlay.module.css";
import AudioPlayer from "@components/audio-player";
import { useEffect, useState } from "react";
import { useAudioStore } from "@stores/audio-store";
import { combineClassNames } from "@utils/style-utils";
import ArtistsLinks from "@components/artists-links";
const AudioPlayerOverlay = () => {
  const playlist = useAudioStore((state) => state.playlist);
  const trackId = useAudioStore((state) => state.currentTrackId);
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

  function handleNext() {}
  function handlePrevious() {}

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
