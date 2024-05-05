import { artistTypeSchema } from "@services/artist-types";
import { userSchema } from "@services/authentication";
import { apiClient } from "@services/base";
import { z } from "zod";

type CreateArtistRequest = {
  name: string;
  artistTypeSlug: string;
  coverFile: {
    id: string;
    url: string;
  };
  userIds: string[];
};

export const artistSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  coverUrl: z.string().url(),
  creatorId: z.string().uuid(),
  type: artistTypeSchema,
  users: userSchema.array(),
});

export type Artist = z.infer<typeof artistSchema>;

export async function createArtist(
  request: CreateArtistRequest,
  abortSignal?: AbortSignal
): Promise<Artist> {
  const result = await apiClient.post("music-service/artists", request, {
    signal: abortSignal,
  });

  return await artistSchema.parseAsync(result.data);
}
