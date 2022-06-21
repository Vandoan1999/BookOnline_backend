import { StatusCodes } from "http-status-codes";

export function ApiError(code: StatusCodes, message: string = "") {
  return {
    code,
    message,
  };
}
