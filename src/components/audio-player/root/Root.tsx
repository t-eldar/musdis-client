import { AudioPlayerContext } from "@components/audio-player/context";
import { useDidMountEffect } from "@hooks/use-did-mount-effect";
import { useAudioStore } from "@stores/audio-store";
import {
  ComponentProps,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";

type RootProps = PropsWithChildren &
  ComponentProps<"div"> & {
    currentSong: {
      title: string;
      audioUrl: string;
      artists: { name: string; slug: string }[];
      coverUrl: string;
    };
    onNext: () => void;
    onPrevious: () => void;
  };

const Root = ({
  children,
  currentSong,
  onNext,
  onPrevious,
  ...rest
}: RootProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const setAudioElement = useAudioStore((state) => state.setAudioElement);
  const setIsPlatingState = useAudioStore((state) => state.setIsPlaying);

  useEffect(() => {
    if (isReady) {
      setAudioElement(audioRef.current);
    }
  }, [isReady, setAudioElement]);

  useDidMountEffect(() => {
    audioRef.current?.pause();

    const timeout = setTimeout(() => {
      audioRef.current?.play();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentSong]);

  function handleNext() {
    onNext();
  }

  function handlePrevious() {
    if (audioRef.current && audioRef.current.currentTime > 5) {
      audioRef.current.currentTime = 0;
    } else {
      onPrevious();
    }
  }

  function handleTogglePlayPause() {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  }

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        currentSong,
        handleClickNext: handleNext,
        handleClickPrevious: handlePrevious,
        handleTogglePlayPause,
        isReady,
        audioElement: audioRef.current,
      }}
    >
      <audio
        ref={audioRef}
        preload="metadata"
        onPlaying={() => {
          setIsPlatingState(true);
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlatingState(false);
          setIsPlaying(false);
        }}
        onEnded={handleNext}
        onCanPlay={() => {
          // e.currentTarget.volume = volume;
          setIsReady(true);
        }}
        // onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
        src={currentSong.audioUrl}
      />
      <div {...rest}>{children}</div>
    </AudioPlayerContext.Provider>
  );
};

export default Root;
