import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

import express, { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import "express-async-errors";

import logger from "jet-logger";
import { ResponseBuilder } from "./ultis/response-builder";
import baseRouter from "@controller/api";

export const get = () => {
  const app = express();

  // Common middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Show routes called in console during development
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  // Security (helmet recommended in express docs)
  if (process.env.NODE_ENV === "production") {
    app.use(helmet());
  }

  // Add api router
  app.use("/api", baseRouter);
  app.use("/demo", (req, res) => {
    res.json({
      status: 200,
      message: "server running success!",
    });
  });

  // Error handling
  app.use((err: any, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        new ResponseBuilder()
          .withMessage(err.message)
          .withError(err.error)
          .build()
      );
  });
  return app;
};
