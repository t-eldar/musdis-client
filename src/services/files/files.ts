import apiClient from "@services/base";
import { getCookie } from "@utils/web-utils";
import { z } from "zod";

const fileDetailsSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
});
export type FileDetails = z.infer<typeof fileDetailsSchema>;

export async function getAntiforgeryToken() {
  await apiClient.get("file-service/antiforgery/token");
}

export async function uploadFile(file: File): Promise<FileDetails> {
  await getAntiforgeryToken();

  const formData = new FormData();
  formData.append("file", file);

  const result = await apiClient.post("file-service/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
    },
  });

  return fileDetailsSchema.parse(result.data);
}
