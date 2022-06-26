import { ResponseTypeEnum } from "@enums/response-type.enum";
import { StatusCodes } from "http-status-codes";

export interface ResponsePayload<T> {
  type: ResponseTypeEnum;
  code?: StatusCodes;
  message?: string;
  error?: any;
  data?: T;
  meta?: unknown;
  __debug__?: unknown;
}
