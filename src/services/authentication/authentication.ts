import { z } from "zod";
import { apiClient } from "@services/base";

export const userSchema = z.object({
  id: z.string().uuid(),
  userName: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url().nullish(),
});

export type User = z.infer<typeof userSchema>;

export type SignInRequest = {
  userNameOrEmail: string;
  password: string;
};
export async function signIn(
  request: SignInRequest,
  abortSignal?: AbortSignal
): Promise<User> {
  const result = await apiClient.post("identity-service/sign-in", request, {
    signal: abortSignal,
  });

  return await userSchema.parseAsync(result.data);
}

export type SignUpRequest = {
  userName: string;
  email: string;
  password: string;
};
export async function signUp(request: SignUpRequest): Promise<User> {
  const result = await apiClient.post("identity-service/sign-up", request);

  return await userSchema.parseAsync(result.data);
}

export async function signOut() {
  const result = await apiClient.get("/sign-out");

  return result.status === 200 ? "success" : "error";
}

export async function getUserInfo(abortSignal?: AbortSignal): Promise<User> {
  const result = await apiClient.get("identity-service/user", {
    signal: abortSignal,
  });

  return await userSchema.parseAsync(result.data.data);
}

type UpdateUserRequest = {
  avatarFile: {
    id: string;
    url: string;
  };
};

export async function updateUser(
  request: UpdateUserRequest,
  abortSignal?: AbortSignal
) {
  const result = await apiClient.patch("/identity-service/users/", request, {
    signal: abortSignal,
  });

  return result.status === 204 ? "success" : "error";
}
