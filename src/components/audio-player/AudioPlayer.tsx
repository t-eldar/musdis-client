import { useSound } from "use-sound";
import { useEffect, useState } from "react";
import { ProgressBar } from "./progress-bar";

type AudioPlayerProps = {
  src: string;
};

type Time = {
  minute: number;
  second: number;
};

const AudioPlayer = ({ src }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { pause, duration, sound }] = useSound(src);

  const [seconds, setSeconds] = useState(0);

  const [time, setTime] = useState<Time>();
  const [currentTime, setCurrentTime] = useState<Time>();

  useEffect(() => {
    if (duration) {
      const sec = duration / 1000;
      const minute = Math.floor(sec / 60);
      const secondsRemain = Math.floor(sec % 60);
      setTime({
        minute: minute,
        second: secondsRemain,
      });
    }
  }, [isPlaying, duration]);

  useEffect(() => {
    if (isPlaying) {
      console.log(sound?.state());

      const interval = setInterval(() => {
        if (sound) {
          const seeked = sound.seek();
          setSeconds(seeked);

          const minute = Math.floor(seeked / 60);
          const second = Math.floor(seeked % 60);
          setCurrentTime({
            minute,
            second,
          });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sound, isPlaying, setSeconds]);

  useEffect(() => {
    console.log(sound?.state());
  }, [sound]);

  const handleProgressBarChange = (value: number) => {
    setSeconds(value);
    sound?.seek(value);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      play();
      setIsPlaying(true);
    }
  };

  return (
    <div>
      <h2>Playing Now</h2>
      <div></div>
      <div>
        <button>prev</button>
        {!isPlaying ? (
          <button onClick={togglePlay}>play</button>
        ) : (
          <button onClick={togglePlay}>pause</button>
        )}
        <button>next</button>
      </div>
      <div>
        {currentTime?.minute}:{currentTime?.second}/{time?.minute}:
        {time?.second}
      </div>
      {duration && (
        <ProgressBar
          durationInSeconds={duration / 1000}
          value={seconds}
          onValueChange={handleProgressBarChange}
        />
      )}
    </div>
  );
};

export default AudioPlayer;
