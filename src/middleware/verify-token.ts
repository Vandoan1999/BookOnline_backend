import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import logger from "jet-logger";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { ResponseBuilder } from "../ultis/response-builder";
import Container from "typedi";
import { UserService } from "@services/user.service";
import { Role } from "@enums/role.enum";
require("dotenv").config();
export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .json(
        new ResponseBuilder()
          .withError()
          .withMessage("No credentials sent!")
          .build()
      );
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userService = Container.get(UserService);
    const user = await userService.detail(decoded["id"]);
    if (
      user[0]?.is_pass_change &&
      user[0]?.is_pass_change === true &&
      user[0].role === Role.USER
    )
      throw ApiError(
        StatusCodes.NOT_FOUND,
        "your pasword reseted, you must change password to access!"
      );
    if (!user) throw ApiError(StatusCodes.NOT_FOUND, "user not exits");
    req["user"] = user[0];
  } catch (error) {
    logger.err("UNHANDLED ERROR: Verify token error ", error);
    throw ApiError(StatusCodes.UNAUTHORIZED, "token expired!", error);
  }
  return next();
}
