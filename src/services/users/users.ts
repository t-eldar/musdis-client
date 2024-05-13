import { apiClient } from "@services/base";
import { z } from "zod";

const userSchema = z.object({
  id: z.string().uuid(),
  userName: z.string(),
  avatarUrl: z.string().url().nullish(),
  email: z.string().email(),
});

export async function getUser(userNameOrId: string, abortSignal?: AbortSignal) {
  const result = await apiClient.get(`identity-service/users/${userNameOrId}`, {
    signal: abortSignal,
  });

  return userSchema.parse(result.data.data);
}
