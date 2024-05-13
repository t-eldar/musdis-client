import { AlertState, useAlertStore } from "@stores/use-alert-store";
import { useCallback } from "react";

export default function useAlert() {
  const setState = useAlertStore((s) => s.setState);
  const setOpen = useAlertStore((s) => s.setOpen);

  return useCallback(
    (state: AlertState) => {
      setState(state);
      setOpen(true);
    },
    [setState, setOpen]
  );
}
