import { useAwait } from "@hooks/use-await";
import { SignInRequest, signIn } from "@services/authentication";
import { useAuthStore } from "@/stores/auth-store";

type Status = "success" | "error";

export default function useSignIn(): {
  invoke: (request: SignInRequest) => Promise<Status>;
  isLoading: boolean | undefined;
  error: Error | undefined;
} {
  const { promise, isLoading, error } = useAwait<typeof signIn>(signIn);

  const setUser = useAuthStore((state) => state.setUser);

  const state = {
    invoke: async (request: SignInRequest) => {
      let status: Status = "error";
      const response = await promise(request);

      if (error || !response) {
        status = "error";
        setUser(null);
      } else {
        status = "success";

        setUser(response);
      }

      return status;
    },
    isLoading,
    error,
  };

  return state;
}
