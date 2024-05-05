import { artistSchema } from "@services/artists";
import { z } from "zod";

export const trackSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  audioUrl: z.string().url(),
  coverUrl: z.string().url(),
  artists: z.array(artistSchema),
});

export type Track = z.infer<typeof trackSchema>;
