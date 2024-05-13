import { useAwait } from "@hooks/use-await";
import { signOut } from "@services/authentication";
import { useAuthStore } from "@stores/auth-store";

export default function useSignOut() {
  const setUser = useAuthStore((state) => state.setUser);
  const { promise } = useAwait(signOut);

  return async () => {
    const result = await promise();
    console.log(result);
    
    if (result === "success") {
      setUser(null);
    }
  };
}
