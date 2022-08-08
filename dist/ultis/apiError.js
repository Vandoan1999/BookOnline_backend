"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
function ApiError(code, message = "", error = null) {
    return {
        type: "error",
        code,
        message,
        error
    };
}
exports.ApiError = ApiError;
