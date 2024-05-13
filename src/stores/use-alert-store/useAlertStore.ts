import { create } from "zustand";

export type AlertState = {
  variant: "info" | "success" | "warning";

  message: string;
  title: string;
};
type AlertStore = {
  open: boolean;
  setOpen: (open: boolean) => void;

  state: AlertState | null;
  setState: (state: AlertState | null) => void;
};
export const useAlertStore = create<AlertStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  state: null,
  setState: (state) => set({ state }),
}));
