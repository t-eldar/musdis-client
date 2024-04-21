import { useAudioPlayerContext } from "@components/audio-player/context";
import { formatTime } from "@utils/time-utils";
import { ComponentProps, useEffect, useState } from "react";

type TimeProgressProps = ComponentProps<"div">;
const TimeProgress = (props: TimeProgressProps) => {

  const context = useAudioPlayerContext();
  if (context === null) {
    throw new Error(
      "Cannot use this component: AudioPlayerContext is null. Please use it inside the AudioPlayer.Root component."
    );
  }

  const { audioElement, isReady } = context;
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audioElement?.duration || 0);

  const currentString = formatTime(currentTime);
  const durationString = formatTime(duration);

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
    <div {...props}>
      {currentString} / {durationString}
    </div>
  );
};

export default TimeProgress;
