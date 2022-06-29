import { StatusCodes } from "http-status-codes";

export enum ResponseTypeEnum {
  ERROR = `error`,
  SUCCESS = `success`,
}

export interface ResponsePayload<T> {
  type: ResponseTypeEnum;
  code?: StatusCodes;
  message?: string;
  error?: any;
  data?: T;
  meta?: unknown;
  __debug__?: unknown;
}

export class ResponseBuilder<T> {
  private payload: ResponsePayload<T> = {
    type: ResponseTypeEnum.SUCCESS,
  };
  constructor(data?: T) {
    this.payload.data = data;
  }
  withSuccess() {
    this.payload.type = ResponseTypeEnum.SUCCESS;
    return this;
  }
  withMessage(message: string) {
    this.payload.message = message;
    return this;
  }
  withMeta(meta: any) {
    this.payload.meta = meta;
    return this;
  }

  withError(err: any = null) {
    this.payload.type = ResponseTypeEnum.ERROR;
    this.payload.error = err;
    return this;
  }

  build() {
    return this.payload;
  }
}
