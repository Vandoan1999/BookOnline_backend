import { Router } from "express";
import authRouter from "./auth.controller";
import bookRouter from "./book.controller";
// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use("/books", bookRouter);
baseRouter.use("/auth", authRouter);

// Export default.
export default baseRouter;
