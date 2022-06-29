import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

import express, { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import "express-async-errors";

import logger from "jet-logger";
import { ResponseBuilder } from "./ultis/response-builder";
import baseRouter from "@controller/api";
import { AppDataSource } from "@config/db";

export const get = () => {
  const app = express();

  // Common middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Show routes called in console during development
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    AppDataSource.initialize();
  }

  // Security (helmet recommended in express docs)
  if (process.env.NODE_ENV === "production") {
    AppDataSource.initialize();

    app.use(helmet());
  }

  // Add api router
  app.use("/api", baseRouter);
  app.get("/", (req, res) => {
    return res.json({ status: 500 });
  });

  // Error handling
  app.use((err: any, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    return res.status(StatusCodes.BAD_REQUEST).json(new ResponseBuilder().withMessage(err.message).withError(err.error).build());
  });

  return app;
};

export const start = () => {
  const app = get();
  const port = process.env.PORT;
  try {
    app.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`);
    });
  } catch (error: any) {
    logger.info(`Error occurred: ${error.message}`);
  }
};
start();
