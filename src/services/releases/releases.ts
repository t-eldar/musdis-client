import { DataResponse } from "@app-types/responses";
import { artistSchema } from "@services/artists";
import { apiClient } from "@services/base";
import { releaseTypeSchema } from "@services/release-types";
import { trackSchema } from "@services/tracks";
import { z } from "zod";

export const releaseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  coverUrl: z.string().url(),
  description: z.string(),
  releaseDate: z.string(),
  type: releaseTypeSchema,
  artists: z.array(artistSchema),
  tracks: z.array(trackSchema),
});

export type Release = z.infer<typeof releaseSchema>;

export async function getRelease(slug: string, abortSignal?: AbortSignal) {
  const result = await apiClient.get<DataResponse<Release>>(
    `music-service/releases/${slug}`,
    {
      signal: abortSignal,
    }
  );

  return await releaseSchema.parseAsync(result.data.data);
}
