import { apiClient } from "@services/base";
import { z } from "zod";

export const releaseTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
});

export type ReleaseType = z.infer<typeof releaseTypeSchema>;

export async function getReleaseTypes(
  abortSignal?: AbortSignal
): Promise<ReleaseType[]> {
  const result = await apiClient.get("music-service/release-types", {
    signal: abortSignal,
  });

  return await releaseTypeSchema.array().parseAsync(result.data);
}
