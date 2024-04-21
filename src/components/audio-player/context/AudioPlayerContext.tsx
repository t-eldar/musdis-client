import { createContext } from "react";

type AudioContext = {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentSong: {
    title: string;
    audioUrl: string;
    author: string;
    coverUrl: string;
  };
  isReady: boolean;
  handleClickNext: () => void;
  handleClickPrevious: () => void;
  handleTogglePlayPause: () => void;
};
export const AudioPlayerContext = createContext<AudioContext | null>(null);