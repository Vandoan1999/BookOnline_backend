import { NextFunction, Request, Response } from "express";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";

import { Role } from "@enums/role.enum";
require("dotenv").config();
export async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req["user"] && req["user"].role === Role.USER) {
    throw ApiError(
      StatusCodes.FORBIDDEN,
      `user name: ${req["user"].username} and email ${req["user"].email} dose not have permission!`
    );
  }
  return next();
}
