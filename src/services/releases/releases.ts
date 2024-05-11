import {
  DataResponse,
  PagedDataResponse,
  paginationInfoSchema,
} from "@app-types/responses";
import { artistSchema } from "@services/artists";
import { apiClient } from "@services/base";
import { FileDetails } from "@services/files";
import { releaseTypeSchema } from "@services/release-types";
import { trackSchema } from "@services/tracks";
import { z } from "zod";

export const releaseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  coverUrl: z.string().url(),
  releaseDate: z.string(),
  releaseType: releaseTypeSchema,
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

  console.log(result.data.data);

  return await releaseSchema.parseAsync(result.data.data);
}

const pagedResultSchema = z.object({
  data: z.array(releaseSchema),
  paginationInfo: paginationInfoSchema,
});

export async function getLatestReleases(
  page: number,
  pageSize: number,
  abortSignal?: AbortSignal
): Promise<PagedDataResponse<Release>> {
  const result = await apiClient.get<PagedDataResponse<Release>>(
    `music-service/releases?page=${page}&pageSize=${pageSize}&sort=releaseDate&sortOrder=desc`,
    {
      signal: abortSignal,
    }
  );

  return await pagedResultSchema.parseAsync(result.data);
}

export async function getArtistReleases(
  idOrSlug: string,
  type?: string,
  abortSignal?: AbortSignal
): Promise<Release[]> {
  const result = await apiClient.get<PagedDataResponse<Release>>(
    "music-service/releases",
    {
      signal: abortSignal,
      params: {
        sort: "releaseDate",
        sortOrder: "desc",
        artistIdOrSlug: idOrSlug,
        type: !type ? undefined : type,
      },
    }
  );

  return await releaseSchema.array().parseAsync(result.data.data);
}

export async function getUserReleases(
  userId: string,
  abortSignal?: AbortSignal
): Promise<Release[]> {
  const result = await apiClient.get<PagedDataResponse<Release>>(
    "music-service/releases",
    {
      signal: abortSignal,
      params: {
        sort: "releaseDate",
        sortOrder: "desc",
        userIds: userId,
      },
    }
  );

  return await releaseSchema.array().parseAsync(result.data.data);
}

type CreateReleaseRequest = {
  name: string;
  releaseTypeSlug: string;
  coverFile: FileDetails;
  tracks: {
    title: string;
    audioFile: FileDetails;
    tagSlugs: string[];
  };
};
export async function createRelease(
  request: CreateReleaseRequest
): Promise<Release> {
  const result = await apiClient.post<DataResponse<Release>>(
    "/music-service/releases",
    request
  );

  return await releaseSchema.parseAsync(result.data.data);
}
