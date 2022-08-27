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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jet_logger_1 = __importDefault(require("jet-logger"));
const apiError_1 = require("../ultis/apiError");
const http_status_codes_1 = require("http-status-codes");
const response_builder_1 = require("../ultis/response-builder");
const user_repository_1 = require("@repos/user.repository");
require("dotenv").config();
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.headers.authorization) {
            return res
                .status(403)
                .json(new response_builder_1.ResponseBuilder()
                .withError()
                .withMessage("No credentials sent!")
                .build());
        }
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield user_repository_1.UserRepository.findOneByOrFail({ id: decoded["id"] });
            if (!user)
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, "user not exits");
            req["user"] = user;
        }
        catch (error) {
            jet_logger_1.default.err("UNHANDLED ERROR: Verify token error ", error);
            throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Verify token error!", error);
        }
        return next();
    });
}
exports.verifyToken = verifyToken;
