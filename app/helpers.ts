import { ServerResponse } from "./types";

export function createResponse<T = undefined>(
  message: string,
  data?: T
): ServerResponse<T> {
  if (data) {
    return {
      successful: true,
      message,
      data,
    };
  }
  return {
    successful: false,
    message,
  };
}
