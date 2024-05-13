import { create } from "zustand";

type User = {
  id: string;
  userName: string;
  email: string;
  avatarUrl?: string | null;
};

type AuthStore = {
  user: User | null | undefined;
  setUser: (user: User | null | undefined) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
