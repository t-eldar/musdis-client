import { ProgressBar } from "@components/audio-player/progress-bar";
import { Controls } from "@components/audio-player/controls";
import { Cover } from "@components/audio-player/cover";
import { Root } from "@components/audio-player/root";
import { TimeProgress } from "@components/audio-player/time-progress";

const AudioPlayer = {
  Root: Root,
  Cover: Cover,
  TimeProgress: TimeProgress,
  Controls: Controls,
  ProgressBar: ProgressBar,
};

export default AudioPlayer;
