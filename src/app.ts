import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

import express, { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import "express-async-errors";

import apiRouter from "./controller/api";
import logger from "jet-logger";
import { ResponseBuilder } from "./ultis/response-builder";
import serverless from 'serverless-http'
import { CustomError } from "@shared/errors";

// Constants
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


app.get('/api', function (req, res) {
  res.send('Hello World!')
})

app.get('/demo', function (req, res) {
  res.send('Hello World! 2')
})

// Add api router
// app.use("/api", apiRouter);

// Error handling
app.use(
  (err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    const status =
      err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST;
    return res.status(status).json(new ResponseBuilder().withError().withMessage(err.message).build());
  }
);


//#### Database

// AppDataSource.initialize()
//   .then(() => {
//     console.info("initialize databse success");

//   })
//   .catch((error: any) => console.log(error));

// Export here and start in a diff file (for testing).
const server = serverless(app);

export const handler = async (
  event: any,
  context: any,
): Promise<any> => {
  return await server(event, context);
};

export default app;
