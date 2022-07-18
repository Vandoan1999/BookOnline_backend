import { Router } from "express";
import authRouter from "./auth.controller";
import bookRouter from "./book.controller";
import userRouter from "./user.controller";
import ratingRouter from "./rating.controller";
import testRouter from "./test.controller";
import categorRouter from "./category.controller";
import supplierRouter from "./supplier.controller";
import billImportRouter from "./bill-import.controller";
import billExportRouter from "./bill-export.controller";
import dashboardRouter from "./dashboard.controller";
// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use("/books", bookRouter);
baseRouter.use("/auth", authRouter);
baseRouter.use("/users", userRouter);
baseRouter.use("/rating", ratingRouter);
baseRouter.use("/categories", categorRouter);
baseRouter.use("/suppliers", supplierRouter);
baseRouter.use("/bill_import", billImportRouter);
baseRouter.use("/bill_export", billExportRouter);
baseRouter.use("/dashboard", dashboardRouter);
baseRouter.use("/test", testRouter);

// Export default.
export default baseRouter;
