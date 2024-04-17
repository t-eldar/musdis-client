import { AxiosError, AxiosResponse } from "axios";

/**
 * Base type of the request.
 * @template TParams - Type of the request parameters.
 * @template TData - Type of the response data.
 */
type BaseRequest<TParams, TData> = (
  params?: TParams
) => Promise<AxiosResponse<TData>>;

/**
 * Success response with fetched data.
 * @template TData - Type of the response data.
 */
type SuccessResponse<TData> = {
  code: "success";
  data: TData;
};

/**
 * Error response.
 * @template TError - Type of the error.
 */
type ErrorResponse<TError = AxiosError> = {
  code: "error";
  error: TError;
};

/**
 * Base response type for request handling.
 * @template TData - Type of the response data.
 * @template TError - Type of the error.
 */
type BaseResponse<TData, TError> = Promise<
  SuccessResponse<TData> | ErrorResponse<TError>
>;

/**
 * Wraps a request function that handles asynchronous requests.
 * @template TParams - Type of the request parameters.
 * @template TData - Type of the response data.
 * @template TError - Type of the error.
 * @param {BaseRequest<TParams, TData>} request - The request function to be wrapped.
 * @returns {BaseResponse<TData, TError>} - A promise resolving to a response.
 */
export default function requestHandler<TParams, TData, TError = AxiosError>(
  request: BaseRequest<TParams, TData>
) {
  return async (params?: TParams): BaseResponse<TData, TError> => {
    try {
      const response = await request(params);
      return { code: "success", data: response.data };
    } catch (e) {
      return { code: "error", error: e as TError };
    }
  };
}