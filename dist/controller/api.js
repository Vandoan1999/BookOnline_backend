"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const book_controller_1 = __importDefault(require("./book.controller"));
const user_controller_1 = __importDefault(require("./user.controller"));
const rating_controller_1 = __importDefault(require("./rating.controller"));
const test_controller_1 = __importDefault(require("./test.controller"));
const category_controller_1 = __importDefault(require("./category.controller"));
const suppelier_controller_1 = __importDefault(require("./suppelier.controller"));
// Export the base-router
const baseRouter = (0, express_1.Router)();
// Setup routers
baseRouter.use("/books", book_controller_1.default);
baseRouter.use("/auth", auth_controller_1.default);
baseRouter.use("/users", user_controller_1.default);
baseRouter.use("/rating", rating_controller_1.default);
baseRouter.use("/categories", category_controller_1.default);
baseRouter.use("/suppliers", suppelier_controller_1.default);
baseRouter.use("/test", test_controller_1.default);
// Export default.
exports.default = baseRouter;
