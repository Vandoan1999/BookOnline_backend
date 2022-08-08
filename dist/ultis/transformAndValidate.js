"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformAndValidate = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const jet_logger_1 = __importDefault(require("jet-logger"));
const apiError_1 = require("./apiError");
const http_status_codes_1 = require("http-status-codes");
function transformAndValidate(cls, plain, validatorOptions = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformed = (0, class_transformer_1.plainToClass)(cls, plain);
        const errors = yield (0, class_validator_1.validate)(transformed, Object.assign({ whitelist: true }, validatorOptions));
        if (errors.length) {
            jet_logger_1.default.info(errors);
            throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, "validate false!", errors);
        }
        return transformed;
    });
}
exports.transformAndValidate = transformAndValidate;
