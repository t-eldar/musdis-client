import styles from "./TimeProgress.module.css";

import { useAudioPlayerContext } from "@components/audio-player/context";
import { combineClassNames } from "@utils/style-utils";
import { formatDuration } from "@utils/time-utils";
import { ComponentProps, useEffect, useState } from "react";

type TimeProgressProps = ComponentProps<"div"> & {
  separator?: React.ReactNode;
};
const TimeProgress = ({ separator = "/", ...props }: TimeProgressProps) => {
  const context = useAudioPlayerContext();
  if (context === null) {
    throw new Error(
      "Cannot use this component: AudioPlayerContext is null. Please use it inside the AudioPlayer.Root component."
    );
  }

  const { className, ...rest } = props;

  const { audioElement, isReady } = context;

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audioElement?.duration || 0);

  const currentString = formatDuration(currentTime);
  const durationString = formatDuration(duration);

  useEffect(() => {
    if (isReady) {
      setCurrentTime(audioElement?.currentTime || 0);
      setDuration(audioElement?.duration || 0);
    }
  }, [isReady, audioElement]);

  useEffect(() => {
    if (!audioElement) {
      return;
    }

    function onTimeUpdate() {
      setCurrentTime(audioElement?.currentTime || 0);
    }
    function onDurationChange() {
      setDuration(audioElement?.duration || 0);
    }

    audioElement.addEventListener("timeupdate", onTimeUpdate);
    audioElement.addEventListener("durationchange", onDurationChange);

    return () => {
      audioElement.removeEventListener("timeupdate", onTimeUpdate);
      audioElement.removeEventListener("durationchange", onDurationChange);
    };
  }, [audioElement]);

  return (
    <div className={combineClassNames(styles.container, className)} {...rest}>
      <span className={styles["current-time"]}>{currentString}</span>{" "}
      <span>{separator}</span>
      <span className={styles.duration}>{durationString}</span>
    </div>
  );
};

export default TimeProgress;
