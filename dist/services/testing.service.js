"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestingService = void 0;
const app_1 = require("@config/app");
const db_1 = require("@config/db");
const typedi_1 = require("typedi");
const jet_logger_1 = __importDefault(require("jet-logger"));
let TestingService = class TestingService {
    constructor() {
        this.list_user = [];
        this.list_supplier = [];
        this.list_category = [];
        this.list_book = [];
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            jet_logger_1.default.info(`start clearing data !`);
            yield db_1.AppDataSource.query(`DELETE FROM ${app_1.config.TablePostgres.user} WHERE role = 'user'`);
            jet_logger_1.default.info(`clear data ${app_1.config.TablePostgres.user} done !`);
            yield db_1.AppDataSource.query(`DELETE FROM ${app_1.config.TablePostgres.books}`);
            jet_logger_1.default.info(`clear data ${app_1.config.TablePostgres.books} done !`);
            yield db_1.AppDataSource.query(`DELETE FROM ${app_1.config.TablePostgres.ratings}`);
            jet_logger_1.default.info(`clear data ${app_1.config.TablePostgres.ratings} done !`);
            yield db_1.AppDataSource.query(`DELETE FROM ${app_1.config.TablePostgres.book_images}`);
            jet_logger_1.default.info(`clear data ${app_1.config.TablePostgres.book_images} done !`);
            yield db_1.AppDataSource.query(`DELETE FROM ${app_1.config.TablePostgres.categories}`);
            jet_logger_1.default.info(`clear data ${app_1.config.TablePostgres.categories} done !`);
            yield db_1.AppDataSource.query(`DELETE FROM ${app_1.config.TablePostgres.suppliers}`);
            jet_logger_1.default.info(`clear data ${app_1.config.TablePostgres.suppliers} done !`);
        });
    }
};
TestingService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], TestingService);
exports.TestingService = TestingService;
