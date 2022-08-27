import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import logger from "jet-logger";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { ResponseBuilder } from "../ultis/response-builder";
import { Role } from "@enums/role.enum";
import { UserRepository } from "@repos/user.repository";
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
    const user = await UserRepository.findOneByOrFail({ id: decoded["id"] });
    if (user.role === Role.USER)
      throw ApiError(
        StatusCodes.NOT_FOUND,
        "your pasword reseted, you must change password to access!"
      );
    if (!user) throw ApiError(StatusCodes.NOT_FOUND, "user not exits");
    req["user"] = user;
  } catch (error) {
    logger.err("UNHANDLED ERROR: Verify token error ", error);
    throw ApiError(StatusCodes.UNAUTHORIZED, "Verify token error!", error);
  }
  return next();
}
