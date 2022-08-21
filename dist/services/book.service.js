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
exports.BookService = void 0;
const book_repository_1 = require("@repos/book.repository");
const http_status_codes_1 = require("http-status-codes");
const apiError_1 = require("../ultis/apiError");
const typedi_1 = require("typedi");
const category_repository_1 = require("@repos/category.repository");
const typeorm_1 = require("typeorm");
const jet_logger_1 = __importDefault(require("jet-logger"));
const image_service_1 = require("./image.service");
let BookService = class BookService {
    constructor(imageService) {
        this.imageService = imageService;
    }
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookExist = yield book_repository_1.BookRepository.findOneBy({ name: request.name });
            if (bookExist) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `name: ${request.name} book existed!`);
            }
            const book = book_repository_1.BookRepository.create(request);
            if (request.categories_id && request.categories_id.length > 0) {
                const categories = [];
                for (let i = 0; i < request.categories_id.length; i++) {
                    const data = yield category_repository_1.CategoryRepository.findOne({
                        where: { id: request.categories_id[i] },
                    });
                    if (data) {
                        categories.push(data);
                    }
                }
                book.categories = categories;
            }
            return book_repository_1.BookRepository.save(book);
        });
    }
    getList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const [books, total] = yield book_repository_1.BookRepository.getList(request);
            return {
                books: yield this.imageService.getImageByObject(books),
                total,
            };
        });
    }
    update(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield book_repository_1.BookRepository.findOneOrFail({
                where: { id: request.id },
                relations: ["categories"],
            });
            if (request.categories_id) {
                const categories = yield category_repository_1.CategoryRepository.find({
                    where: { id: (0, typeorm_1.In)(request.categories_id) },
                });
                const invalidCategory = [];
                for (const ct of categories) {
                    const category = request.categories_id.find((i) => i == ct.id);
                    if (!category) {
                        invalidCategory.push(category);
                    }
                }
                if (invalidCategory.length > 0) {
                    throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `categories invalid`, {
                        invalidCategory,
                    });
                }
                book.categories = categories;
            }
            for (const key in request) {
                if (book.hasOwnProperty(key)) {
                    if (key === "sold") {
                        book[key] += 1;
                        continue;
                    }
                    if (key === "views") {
                        book[key] += 1;
                        continue;
                    }
                    book[key] = request[key];
                }
            }
            return book_repository_1.BookRepository.save(book);
        });
    }
    detail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield book_repository_1.BookRepository.findOneOrFail({
                where: { id },
                relations: ["categories"],
            });
            for (let ct of book.categories) {
                const category = yield this.imageService.getImageByObject([ct]);
                ct = category[0];
            }
            return this.imageService.getImageByObject([book]);
        });
    }
    delete(idsRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            let ids = idsRequest.split(",");
            const books = yield book_repository_1.BookRepository.find({ where: { id: (0, typeorm_1.In)(ids) } });
            if (books.length === 0) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `book width ids ${ids.toString()} not found`);
            }
            const invalidBook = [];
            for (const book of books) {
                const id = ids.find((id) => id === book.id);
                if (!id) {
                    invalidBook.push(book.id);
                }
            }
            if (invalidBook.length > 0) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `book id not valid`, {
                    invalidBook,
                });
            }
            const idBook = books.map((item) => item.id);
            jet_logger_1.default.info(`Start delete book from db! `);
            yield book_repository_1.BookRepository.remove(books);
            jet_logger_1.default.info(`Deleted book from db done! `);
            yield this.imageService.delete(null, idBook.toString());
        });
    }
};
BookService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [image_service_1.ImageService])
], BookService);
exports.BookService = BookService;
