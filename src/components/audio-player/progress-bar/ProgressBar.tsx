import * as Slider from "@radix-ui/react-slider";
import styles from "./ProgressBar.module.css";
import { combineClassNames } from "@utils/style-utils";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { useAudioPlayerContext } from "@components/audio-player/context";

type ProgressBarProps = Omit<ComponentProps<"span">, "dir" | "defaultValue">;
function approximatelyEqual(first: number, second: number): boolean {
  return Math.abs(first - second) < 1;
}

const NOT_SELECTED = -1;
const ProgressBar = (props: ProgressBarProps) => {
  const context = useAudioPlayerContext();
  if (context === null) {
    throw new Error(
      "Cannot use this component: AudioPlayerContext is null. Please use it inside the AudioPlayer.Root component."
    );
  }

  const { audioElement, isReady } = context;

  const [progress, setProgress] = useState(0);
  const [selectedProgress, setSelectedProgress] = useState(NOT_SELECTED);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!audioElement) {
      return;
    }

    function onDurationChange() {
      setSelectedProgress(NOT_SELECTED);
    }
    function onPlay() {
      setIsPlaying(true);
    }
    function onPause() {
      setIsPlaying(false);
    }

    audioElement.addEventListener("play", onPlay);
    audioElement.addEventListener("pause", onPause);
    audioElement.addEventListener("durationchange", onDurationChange);

    return () => {
      audioElement.removeEventListener("play", onPlay);
      audioElement.removeEventListener("pause", onPause);
      audioElement.removeEventListener("durationchange", onDurationChange);
    };
  }, [audioElement]);

  useEffect(() => {
    if (!audioElement) {
      return;
    }

    audioElement.ontimeupdate = () => {
      if (!isMouseDown) {
        setProgress(audioElement.currentTime);
      }
    };
  }, [audioElement, isMouseDown, isReady]);

  useEffect(() => {
    if (
      selectedProgress !== NOT_SELECTED &&
      !isMouseDown &&
      !approximatelyEqual(selectedProgress, audioElement?.currentTime || 0)
    ) {
      if (!audioElement) {
        return;
      }

      audioElement.currentTime = selectedProgress;
    }
  }, [selectedProgress, isMouseDown, audioElement]);

  function handleValueChange(value: number[]) {
    setProgress(value[0]);
    setSelectedProgress(value[0]);
    if (!isMouseDown) {
      if (!audioElement) {
        return;
      }
      audioElement.currentTime = value[0];
    }
  }

  return (
    <Slider.Root
      {...props}
      className={combineClassNames(
        styles["slider-root"],
        props.className || ""
      )}
      value={[progress]}
      onValueChange={handleValueChange}
      max={audioElement?.duration || 0}
      step={1.5}
      onPointerDown={() => {
        setIsMouseDown(true);
      }}
      onPointerUp={() => {
        setIsMouseDown(false);
      }}
    >
      <Slider.Track className={styles["slider-track"]}>
        <Slider.Range className={styles["slider-range"]} />
      </Slider.Track>
      <Slider.Thumb
        ref={thumbRef}
        className={combineClassNames(
          styles["slider-thumb"],
          isPlaying ? styles.playing : ""
        )}
        aria-label="Audio"
      />
    </Slider.Root>
  );
};

export default ProgressBar;
