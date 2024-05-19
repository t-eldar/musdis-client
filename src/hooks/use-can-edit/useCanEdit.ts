import { useState, useEffect } from "react";
import { useAuthStore } from "@stores/auth-store";

export default function useCanEdit(
  entityToEdit: { creatorId: string } | undefined
) {
  const [canEdit, setCanEdit] = useState<boolean | undefined>();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user === null || (user && user.id !== entityToEdit?.creatorId)) {
      setCanEdit(false);
    }
    if (user && user.id === entityToEdit?.creatorId) {
      setCanEdit(true);
    }
  }, [user, entityToEdit]);

  return canEdit;
}
