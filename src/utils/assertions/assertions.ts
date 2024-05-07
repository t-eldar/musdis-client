import { AxiosError, CanceledError } from "axios";

// eslint-disable-next-line
export function isError(value: any): value is Error {
  return (
    value &&
    value.stack &&
    value.message &&
    typeof value.stack === "string" &&
    typeof value.message === "string"
  );
}

export function isCancelledError(
  value: Error | any //eslint-disable-line
): value is CanceledError<unknown> {
  return (
    isError(value) &&
    value.name === "CanceledError" &&
    "code" in value &&
    value.code === "ERR_CANCELED"
  );
}

//eslint-disable-next-line
export function isAxiosError(value: any): value is AxiosError {
  return (
    isError(value) &&
    "code" in value &&
    "config" in value &&
    "response" in value &&
    typeof value.response === "object" &&
    "status" in (value.response || {})
  );
}
