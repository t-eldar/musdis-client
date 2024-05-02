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
export async function signIn(request: SignInRequest): Promise<User> {
  const result = await apiClient.post("identity-service/sign-in", request);

  return userSchema.parse(result.data);
}

export type SignUpRequest = {
  userName: string;
  avatarFile: {
    id: string;
    url: string;
  };
  email: string;
  password: string;
};
export async function signUp(request: SignUpRequest): Promise<User> {
  const result = await apiClient.post("identity-service/sign-up", request);

  return userSchema.parse(result.data);
}
