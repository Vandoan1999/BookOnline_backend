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
const image_repository_1 = require("@repos/image.repository");
let BookService = class BookService {
    constructor(imageService) {
        this.imageService = imageService;
    }
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = book_repository_1.BookRepository.create(request);
            if (request.categories_id && request.categories_id.length > 0) {
                const categories = yield category_repository_1.CategoryRepository.find({
                    where: { id: (0, typeorm_1.In)([request.categories_id]) },
                });
                const invalidCategory = [];
                for (const cate of categories) {
                    const category = request.categories_id.findIndex((i) => i === cate.id);
                    if (category === -1) {
                        invalidCategory.push(cate.id);
                    }
                }
                if (invalidCategory.length > 0) {
                    if (invalidCategory.length > 0) {
                        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `categories invalid`, {
                            invalidCategory,
                        });
                    }
                }
                book.categories = categories;
            }
            if (request.images && request.images.length > 0) {
                const image = yield image_repository_1.ImageRepository.find({
                    where: { id: (0, typeorm_1.In)(request.images.map((i) => i.id)) },
                });
                if (image.length !== request.images.length) {
                    throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `Image not exits`, {});
                }
                book.images = JSON.stringify(image);
            }
            if (request.avartar) {
                const image = yield image_repository_1.ImageRepository.findOneOrFail({
                    where: { id: request.avartar.id },
                });
                book.avartar = JSON.stringify(image);
            }
            const bookAfterSave = yield book_repository_1.BookRepository.save(book);
            if (bookAfterSave.avartar) {
                bookAfterSave.avartar = JSON.parse(bookAfterSave.avartar);
            }
            if (bookAfterSave.images) {
                bookAfterSave.images = JSON.parse(bookAfterSave.images);
            }
            return bookAfterSave;
        });
    }
    getList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const [books, total] = yield book_repository_1.BookRepository.getList(request);
            books.forEach((book) => {
                if (book.avartar) {
                    book.avartar = JSON.parse(book.avartar);
                }
                if (book.images) {
                    book.images = JSON.parse(book.images);
                }
            });
            return {
                books,
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
                    if (key === "images") {
                        continue;
                    }
                    if (key === "avartar") {
                        continue;
                    }
                    book[key] = request[key];
                }
            }
            if (request.images && request.images.length > 0) {
                const image = yield image_repository_1.ImageRepository.find({
                    where: { id: (0, typeorm_1.In)(request.images.map((i) => i.id)) },
                });
                if (image.length !== request.images.length) {
                    throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `Image not exits`, {});
                }
                book.images = JSON.stringify(image);
            }
            if (request.avartar) {
                const image = yield image_repository_1.ImageRepository.findOneOrFail({
                    where: { id: request.avartar.id },
                });
                book.avartar = JSON.stringify(image);
            }
            const bookAfterSave = yield book_repository_1.BookRepository.save(book);
            if (bookAfterSave.avartar) {
                bookAfterSave.avartar = JSON.parse(bookAfterSave.avartar);
            }
            if (bookAfterSave.images) {
                bookAfterSave.images = JSON.parse(bookAfterSave.images);
            }
            return bookAfterSave;
        });
    }
    detail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield book_repository_1.BookRepository.findOneOrFail({
                where: { id },
                relations: ["categories"],
            });
            if (book.avartar) {
                book.avartar = JSON.parse(book.avartar);
            }
            if (book.images) {
                book.images = JSON.parse(book.images);
            }
            return book;
        });
    }
    delete(idsRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            let ids = idsRequest.split(",");
            const books = yield book_repository_1.BookRepository.find({ where: { id: (0, typeorm_1.In)(ids) } });
            const imageTobeDelete = [];
            if (books.length === 0) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `book width ids ${ids.toString()} not found`);
            }
            const invalidBook = [];
            for (const book of books) {
                const id = ids.find((id) => id === book.id);
                if (!id) {
                    invalidBook.push(book.id);
                }
                if (book.avartar) {
                    imageTobeDelete.push(JSON.parse(book.avartar).id);
                }
                if (book.images) {
                    imageTobeDelete.push(...JSON.parse(book.images).map((i) => i.id));
                }
            }
            if (invalidBook.length > 0) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `book id not valid`, {
                    invalidBook,
                });
            }
            jet_logger_1.default.info(`Start delete book from db! `);
            yield book_repository_1.BookRepository.remove(books);
            jet_logger_1.default.info(`Deleted book from db done! `);
            yield this.imageService.delete(imageTobeDelete);
        });
    }
};
BookService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [image_service_1.ImageService])
], BookService);
exports.BookService = BookService;
