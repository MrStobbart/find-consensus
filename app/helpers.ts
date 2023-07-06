import { ServerResponse } from "./types";

export function createResponse<T = undefined>(
  message: string,
  data?: T
): ServerResponse<T> {
  if (data) {
    return {
      ok: true,
      message,
      data,
    };
  }
  return {
    ok: false,
    message,
  };
}
