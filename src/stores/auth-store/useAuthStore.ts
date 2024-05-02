import { create } from "zustand";

type User = {
  id: string;
  userName: string;
  email: string;
  avatarUrl?: string | null;
};

type AuthStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
