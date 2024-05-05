import styles from "./Cover.module.css";

import { useAudioPlayerContext } from "@components/audio-player/context";
import { combineClassNames } from "@utils/style-utils";
import { ComponentProps } from "react";

type CoverProps = ComponentProps<"div">;

const Cover = (props: CoverProps) => {
  const context = useAudioPlayerContext();
  if (context === null) {
    throw new Error(
      "Cannot use this component: AudioPlayerContext is null. Please use it inside the AudioPlayer.Root component."
    );
  }

  const { currentSong } = context;

  return (
    <div
      className={combineClassNames(styles["cover-container"], props.className)}
      {...props}
    >
      <img
        className={styles.cover}
        src={currentSong.coverUrl}
        alt="Upload preview"
      />
    </div>
  );
};

export default Cover;
