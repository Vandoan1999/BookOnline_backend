"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const jet_logger_1 = __importDefault(require("jet-logger"));
const db_1 = require("@config/db");
const app = (0, server_1.get)();
const port = process.env.PORT;
db_1.AppDataSource.initialize().then(() => {
    jet_logger_1.default.info(`Database connect success`);
    app.listen(port, () => {
        jet_logger_1.default.info(`Server running on http://localhost:${port}`);
    });
});
