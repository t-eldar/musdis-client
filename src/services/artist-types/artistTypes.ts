import { apiClient } from "@services/base";
import { z } from "zod";

export const artistTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
});

export type ArtistType = z.infer<typeof artistTypeSchema>;

export async function getArtistTypes(
  abortSignal?: AbortSignal
): Promise<ArtistType[]> {
  const result = await apiClient.get("music-service/artist-types", {
    signal: abortSignal,
  });

  return await artistTypeSchema.array().parseAsync(result.data.data);
}
