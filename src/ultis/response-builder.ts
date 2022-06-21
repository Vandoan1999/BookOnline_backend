import { ResponseTypeEnum } from "@enums/response-type.enum";
import { ResponsePayload } from "@models/response-payload";

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

  withError() {
    this.payload.type = ResponseTypeEnum.ERROR;
    return this;
  }

  build() {
    return this.payload;
  }
}
