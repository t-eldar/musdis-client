import {
  DataResponse,
  PagedDataResponse,
  paginationInfoSchema,
} from "@app-types/responses";
import { artistSchema } from "@services/artists";
import { apiClient } from "@services/base";
import { FileDetails } from "@services/files";
import { releaseTypeSchema } from "@services/release-types";
import { tagSchema } from "@services/tags";
import { z } from "zod";

export const releaseTrackSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  audioUrl: z.string().url(),
  coverUrl: z.string().url(),
  artists: z.array(artistSchema),
  creatorId: z.string().uuid(),
  tags: z.array(tagSchema),
});
export type ReleaseTrack = z.infer<typeof releaseTrackSchema>;

export const releaseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  creatorId: z.string().uuid(),
  slug: z.string(),
  coverUrl: z.string().url(),
  releaseDate: z.string(),
  releaseType: releaseTypeSchema,
  artists: z.array(artistSchema),
  tracks: z.array(releaseTrackSchema),
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

const pagedResultSchema = z.object({
  data: z.array(releaseSchema),
  paginationInfo: paginationInfoSchema,
});

export async function getLatestReleases(
  page: number,
  pageSize: number,
  search?: string,
  abortSignal?: AbortSignal
): Promise<PagedDataResponse<Release>> {
  const result = await apiClient.get<PagedDataResponse<Release>>(
    "music-service/releases",
    {
      signal: abortSignal,
      params: {
        search: search ? search : undefined,
        page,
        pageSize,
        sort: "releaseDate",
        sortOrder: "desc",
      },
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
  artistIds: string[];
  tracks: {
    title: string;
    audioFile: FileDetails;
    tagSlugs: string[];
  }[];
};
export async function createRelease(
  request: CreateReleaseRequest
): Promise<Release> {
  const result = await apiClient.post<DataResponse<Release>>(
    "/music-service/releases",
    request
  );

  return await releaseSchema.parseAsync(result.data);
}

type UpdateReleaseRequest = {
  name?: string;
  releaseTypeSlug?: string;
  coverFile?: FileDetails;
};

export async function updateRelease(
  id: string,
  request: UpdateReleaseRequest,
  abortSignal?: AbortSignal
) {
  const result = await apiClient.patch(
    `/music-service/releases/${id}`,
    request,
    {
      signal: abortSignal,
    }
  );

  return result.status === 204 ? "success" : "error";
}

export async function deleteRelease(id: string, abortSignal?: AbortSignal) {
  const result = await apiClient.delete(`/music-service/releases/${id}`, {
    signal: abortSignal,
  });

  return result.status === 204 || result.status === 200 ? "success" : "error";
}
