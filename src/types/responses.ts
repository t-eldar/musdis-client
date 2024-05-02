/**
 * The response with wrapped data.
 * 
 * @template TData - Type of the response data.
 */
export type DataResponse<TData> = {
  data: TData;
};

/**
 * The response with wrapped collection of data and additional pagination info.
 * 
 * @template TData - Type of the response data.
 */
export type PagedDataResponse<TData> = {
  data: TData[];
  paginationInfo: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
};