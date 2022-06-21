import { StatusCodes } from "http-status-codes";

export function ApiError(code: StatusCodes, message: string = "", error: any = null) {
  return {
    type: "error",
    code,
    message,
    error
  };
}
