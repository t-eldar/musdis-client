import { artistSchema } from "@services/artists";
import apiClient from "@services/base";
import { releaseSchema } from "@services/releases";
import { tagSchema } from "@services/tags";
import { z } from "zod";

export const trackSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  audioUrl: z.string().url(),
  coverUrl: z.string().url(),
  creatorId: z.string().uuid(),
  artists: z.array(artistSchema),
  tags: z.array(tagSchema),
  release: releaseSchema.omit({ tracks: true }),
});

type CreateTrackForm = {
  title: string;
  releaseId: string;
  audioFile: {
    id: string;
    url: string;
  };
  artistIds: string[];
  tagSlugs: string[];
};
export async function createTrack(
  request: CreateTrackForm,
  abortSignal?: AbortSignal
) {
  const result = await apiClient.post("/music-service/tracks", request, {
    signal: abortSignal,
  });

  return await trackSchema.parseAsync(result.data);
}

type UpdateTrackRequest = {
  title?: string;
  audioFile?: {
    id: string;
    url: string;
  };
  tagSlugs?: string[];
};

export async function updateTrack(
  trackId: string,
  request: UpdateTrackRequest,
  abortSignal?: AbortSignal
) {
  const result = await apiClient.patch(
    `/music-service/tracks/${trackId}`,
    request,
    {
      signal: abortSignal,
    }
  );

  return result.status === 204 ? "success" : "error";
}

export async function deleteTrack(trackId: string, abortSignal?: AbortSignal) {
  const result = await apiClient.delete(`/music-service/tracks/${trackId}`, {
    signal: abortSignal,
  });

  return result.status === 204 || result.status === 200 ? "success" : "error";
}
