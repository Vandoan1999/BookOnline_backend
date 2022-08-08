"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseBuilder = exports.ResponseTypeEnum = void 0;
var ResponseTypeEnum;
(function (ResponseTypeEnum) {
    ResponseTypeEnum["ERROR"] = "error";
    ResponseTypeEnum["SUCCESS"] = "success";
})(ResponseTypeEnum = exports.ResponseTypeEnum || (exports.ResponseTypeEnum = {}));
class ResponseBuilder {
    constructor(data) {
        this.payload = {
            type: ResponseTypeEnum.SUCCESS,
        };
        this.payload.data = data;
    }
    withSuccess() {
        this.payload.type = ResponseTypeEnum.SUCCESS;
        return this;
    }
    withMessage(message) {
        this.payload.message = message;
        return this;
    }
    withMeta(meta) {
        this.payload.meta = meta;
        return this;
    }
    withError(err = null) {
        this.payload.type = ResponseTypeEnum.ERROR;
        this.payload.error = err;
        return this;
    }
    build() {
        return this.payload;
    }
}
exports.ResponseBuilder = ResponseBuilder;
