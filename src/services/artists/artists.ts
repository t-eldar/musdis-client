import { PagedDataResponse, paginationInfoSchema } from "@app-types/responses";
import { artistTypeSchema } from "@services/artist-types";
import { apiClient } from "@services/base";
import { releaseTypeSchema } from "@services/release-types";
import { z } from "zod";

export const artistSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  coverUrl: z.string().url(),
  creatorId: z.string().uuid(),
  type: artistTypeSchema,
  users: z.array(
    z.object({
      artistId: z.string().uuid(),
      userId: z.string().uuid(),
      userName: z.string(),
    })
  ),
});

export type Artist = z.infer<typeof artistSchema>;

type CreateArtistRequest = {
  name: string;
  artistTypeSlug: string;
  coverFile: {
    id: string;
    url: string;
  };
  userIds: string[];
};
export async function createArtist(
  request: CreateArtistRequest,
  abortSignal?: AbortSignal
): Promise<Artist> {
  const result = await apiClient.post("music-service/artists", request, {
    signal: abortSignal,
  });

  return await artistSchema.parseAsync(result.data);
}

export async function getArtist(idOrSlug: string, abortSignal?: AbortSignal) {
  const result = await apiClient.get(`music-service/artists/${idOrSlug}`, {
    signal: abortSignal,
  });

  return await artistSchema.parseAsync(result.data.data);
}

export async function getUsedReleaseTypes(
  idOrSlug: string,
  abortSignal?: AbortSignal
) {
  const result = await apiClient.get(
    `music-service/artists/${idOrSlug}/used-release-types`,
    {
      signal: abortSignal,
    }
  );

  releaseTypeSchema;

  console.log(result);

  return await releaseTypeSchema.array().parseAsync(result.data.data);
}

const pagedDataResponseSchema = z.object({
  data: z.array(artistSchema),
  paginationInfo: paginationInfoSchema,
});

export async function getArtists(
  page: number,
  pageSize: number,
  abortSignal?: AbortSignal
): Promise<PagedDataResponse<Artist>> {
  const result = await apiClient.get<PagedDataResponse<Artist>>(
    "music-service/artists",
    {
      signal: abortSignal,
      params: {
        page,
        pageSize,
        sort: "name",
        sortOrder: "asc",
      },
    }
  );

  return await pagedDataResponseSchema.parseAsync(result.data);
}
