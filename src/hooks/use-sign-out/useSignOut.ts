import useAlert from "@hooks/use-alert";
import { useAwait } from "@hooks/use-await";
import { signOut } from "@services/authentication";
import { useAuthStore } from "@stores/auth-store";

export default function useSignOut() {
  const setUser = useAuthStore((state) => state.setUser);
  const { promise } = useAwait(signOut);

  const alert = useAlert();

  return async () => {
    const result = await promise();

    if (result === "success") {
      setUser(null);
      alert({
        variant: "info",
        title: "Sign Out",
        message: "You have been signed out successfully.",
      });
    }
  };
}
