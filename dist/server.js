"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
require("express-async-errors");
const jet_logger_1 = __importDefault(require("jet-logger"));
const response_builder_1 = require("./ultis/response-builder");
const api_1 = __importDefault(require("@controller/api"));
const get = () => {
    const app = (0, express_1.default)();
    // Common middlewares
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    // Show routes called in console during development
    if (process.env.NODE_ENV === "development") {
        app.use((0, morgan_1.default)("dev"));
    }
    // Security (helmet recommended in express docs)
    if (process.env.NODE_ENV === "production") {
        app.use((0, helmet_1.default)());
    }
    // Add api router
    app.use("/api", api_1.default);
    app.use("/demo", (req, res) => {
        res.json({
            status: 200,
            message: "server running success!",
        });
    });
    // Error handling
    app.use((err, _, res, __) => {
        jet_logger_1.default.err(err, true);
        return res
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json(new response_builder_1.ResponseBuilder()
            .withMessage(err.message)
            .withError(err.error)
            .build());
    });
    return app;
};
exports.get = get;
