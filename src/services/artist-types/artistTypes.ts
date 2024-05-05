import { apiClient } from "@services/base";
import { z } from "zod";
import type { DataResponse } from "@app-types/responses";

export const artistTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
});

const wrappedSchema = z.object({
  data: artistTypeSchema.array(),
});

export type ArtistType = z.infer<typeof artistTypeSchema>;

export async function getArtistTypes(
  abortSignal?: AbortSignal
): Promise<DataResponse<ArtistType[]>> {
  const result = await apiClient.get("music-service/artist-types", {
    signal: abortSignal,
  });

  return await wrappedSchema.parseAsync(result.data);
}
