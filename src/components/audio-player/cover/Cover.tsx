import * as AspectRatio from "@radix-ui/react-aspect-ratio";

import { useAudioPlayerContext } from "@components/audio-player/context";
import styles from "./Cover.module.css";

const Cover = () => {
  const context = useAudioPlayerContext();
  if (context === null) {
    throw new Error(
      "Cannot use this component: AudioPlayerContext is null. Please use it inside the AudioPlayer.Root component."
    );
  }

  const { currentSong } = context;

  return (
    <div className={styles["cover-container"]}>
      <AspectRatio.Root ratio={1}>
        <img
          className={styles.cover}
          src={currentSong.coverUrl}
          alt="Upload preview"
        />
      </AspectRatio.Root>
    </div>
  );
};

export default Cover;
