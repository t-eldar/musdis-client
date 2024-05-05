import { Dispatch, SetStateAction, createContext } from "react";

type AudioContext = {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  currentSong: {
    title: string;
    audioUrl: string;
    artists: {
      name: string;
      slug: string;
    }[];
    coverUrl: string;
  };
  isReady: boolean;
  handleClickNext: () => void;
  handleClickPrevious: () => void;
  handleTogglePlayPause: () => void;
};
export const AudioPlayerContext = createContext<AudioContext | null>(null);
