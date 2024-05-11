import apiClient from "@services/base";
import { z } from "zod";

export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
});
export type Tag = z.infer<typeof tagSchema>;

export async function getTags(abortSignal: AbortSignal): Promise<Tag[]> {
  const result = await apiClient.get("/music-service/tags", {
    signal: abortSignal,
  });

  return await tagSchema.array().parseAsync(result.data.data);
}
