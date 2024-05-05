import apiClient from "@services/base";
import { getCookie } from "@utils/web-utils";
import { z } from "zod";

const fileDetailsSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
});
export type FileDetails = z.infer<typeof fileDetailsSchema>;

export async function getAntiforgeryToken(abortSignal?: AbortSignal) {
  await apiClient.get("file-service/antiforgery/token", {
    signal: abortSignal,
  });
}

export async function uploadFile(
  file: File,
  abortSignal?: AbortSignal
): Promise<FileDetails> {
  await getAntiforgeryToken(abortSignal);

  const formData = new FormData();
  formData.append("file", file);

  const result = await apiClient.post("file-service/files", formData, {
    signal: abortSignal,
    headers: {
      "Content-Type": "multipart/form-data",
      "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
    },
  });

  return fileDetailsSchema.parse(result.data);
}
