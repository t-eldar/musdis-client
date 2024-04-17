import * as Slider from "@radix-ui/react-slider";
import styles from "./ProgressBar.module.css";

type ProgressBarProps = {
  durationInSeconds: number;
  value: number;
  onValueChange: (value: number) => void;
};

export const ProgressBar = ({
  durationInSeconds,
  value,
  onValueChange,
}: ProgressBarProps) => {
  return (
    <>
      <span>{formatTime(value)}</span>
      <Slider.Root
        className={styles["slider-root"]}
        value={[value]}
        onValueChange={([value]) => onValueChange(value)}
        max={durationInSeconds}
        step={5}
      >
        <Slider.Track className={styles["slider-track"]}>
          <Slider.Range className={styles["slider-range"]} />
        </Slider.Track>
        <Slider.Thumb className={styles["slider-thumb"]} aria-label="Audio" />
      </Slider.Root>
    </>
  );
};

function formatTime(time: number) {
  if (time && !isNaN(time)) {
    const minutes = Math.floor(time / 60);
    const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    const seconds = Math.floor(time % 60);
    const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${formatMinutes}:${formatSeconds}`;
  }
  return "00:00";
}

export default ProgressBar;
