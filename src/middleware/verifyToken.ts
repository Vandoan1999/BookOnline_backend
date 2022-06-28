import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import logger from "jet-logger";
import { ApiError } from "src/ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { ResponseBuilder } from "src/ultis/response-builder";
import Container from "typedi";
import { UserService } from "@services/user.service";
require("dotenv").config();
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return res.status(403).json(new ResponseBuilder().withSuccess().withMessage("No credentials sent!").build());
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userService = Container.get(UserService);
    const user = await userService.detail(decoded["id"]);
    if (!user) throw ApiError(StatusCodes.NOT_FOUND, "user not exits");
    req["user"] = user[0];
  } catch (error) {
    logger.err("UNHANDLED ERROR: Verify token error ", error);
    throw ApiError(StatusCodes.UNAUTHORIZED, "token expired!");
  }
  return next();
}
