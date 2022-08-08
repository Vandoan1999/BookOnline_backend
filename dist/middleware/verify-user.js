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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const apiError_1 = require("../ultis/apiError");
const http_status_codes_1 = require("http-status-codes");
const role_enum_1 = require("@enums/role.enum");
require("dotenv").config();
function verifyUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req["user"] && req["user"].role === role_enum_1.Role.USER) {
            throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.FORBIDDEN, `user name: ${req["user"].username} and email ${req["user"].email} dose not have permission!`);
        }
        return next();
    });
}
exports.verifyUser = verifyUser;
