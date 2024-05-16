import { create } from "zustand";
import type { ReleaseTrack } from "@services/releases";

type AudioStore = {
  playlist: ReleaseTrack[] | null;
  setPlaylist: (queue: ReleaseTrack[] | null) => void;

  currentTrackId: string | null;
  setCurrentTrackId: (id: string | null) => void;

  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;

  audioElement: HTMLAudioElement | null;
  setAudioElement: (audioElement: HTMLAudioElement | null) => void;
};

export const useAudioStore = create<AudioStore>((set) => ({
  playlist: null,
  setPlaylist: (playlist) => set({ playlist }),

  currentTrackId: null,
  setCurrentTrackId: (currentTrackId) => set({ currentTrackId }),

  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  audioElement: null,
  setAudioElement: (audioElement) => {
    set({ audioElement });
  },
}));
