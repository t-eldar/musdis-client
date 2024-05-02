import { useAwait } from "@hooks/use-await";
import { SignUpRequest, signUp } from "@services/authentication";
import { useAuthStore } from "@stores/auth-store";

type Status = "success" | "error";

export default function useSignUp(): {
  invoke: (request: SignUpRequest) => Promise<Status>;
  isLoading: boolean;
  error: Error | undefined;
} {
  const { promise, isLoading, error } = useAwait<typeof signUp>(signUp);

  const setUser = useAuthStore((state) => state.setUser);

  const state = {
    invoke: async (request: SignUpRequest) => {
      let status: Status = "error";
      const response = await promise(request);

      if (error || !response) {
        status = "error";
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
