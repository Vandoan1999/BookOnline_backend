import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { UserInfo } from "@models/user/UserInfo";
import logger from "jet-logger";
import { ApiError } from "src/ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { ResponseBuilder } from "src/ultis/response-builder";
require("dotenv").config();
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return res.status(403).json(new ResponseBuilder().withSuccess().withMessage("No credentials sent!").build());
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req["user"] = plainToClass(UserInfo, decoded);
  } catch (error) {
    logger.err("UNHANDLED ERROR: Verify token error ", error);
    throw ApiError(StatusCodes.UNAUTHORIZED, "token expired!",);
  }
  return next();
}
