import { z } from "zod";

/**
 * The response with wrapped data.
 *
 * @template TData - Type of the response data.
 */
export type DataResponse<TData> = {
  data: TData;
};

export const paginationInfoSchema = z.object({
  currentPage: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
  hasPrevious: z.boolean(),
  hasNext: z.boolean(),
});

/**
 * The response with wrapped collection of data and additional pagination info.
 *
 * @template TData - Type of the response data.
 */
export type PagedDataResponse<TData> = {
  data: TData[];
  paginationInfo: z.infer<typeof paginationInfoSchema>;
};
