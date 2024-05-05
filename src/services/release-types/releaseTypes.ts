import { z } from "zod";

export const releaseTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
});

export type ReleaseType = z.infer<typeof releaseTypeSchema>;


