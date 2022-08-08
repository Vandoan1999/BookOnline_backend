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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const book_repository_1 = require("@repos/book.repository");
const http_status_codes_1 = require("http-status-codes");
const apiError_1 = require("../ultis/apiError");
const typedi_1 = require("typedi");
const image_repository_1 = require("@repos/image.repository");
const category_repository_1 = require("@repos/category.repository");
const typeorm_1 = require("typeorm");
const baseAWS_1 = require("@common/baseAWS");
const app_1 = require("@config/app");
const update_book_category_request_1 = require("@models/book/update-book-category.request");
let BookService = class BookService {
    constructor() { }
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookExist = yield book_repository_1.BookRepository.findOneBy({ name: request.name });
            if (bookExist) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `name: ${request.name} book existed!`);
            }
            const book = book_repository_1.BookRepository.create(request);
            if (request.category_id && request.category_id.length > 0) {
                const categories = [];
                for (let i = 0; i < request.category_id.length; i++) {
                    const data = yield category_repository_1.CategoryRepository.findOne({
                        where: { id: request.category_id[i] },
                    });
                    if (data) {
                        categories.push(data);
                    }
                }
                book.categories = categories;
            }
            if (request === null || request === void 0 ? void 0 : request.avatar_data[0]) {
                const newImageName = Math.random() + request.avatar_data[0].originalname;
                yield (0, baseAWS_1.uploadFile)(request.avatar_data[0].buffer, app_1.config.s3Bucket, request.avatar_data[0].mimetype, app_1.config.s3BucketForder + newImageName);
                book.avatar = newImageName;
            }
            const bookSaved = yield book_repository_1.BookRepository.save(book);
            if (bookSaved && request.images_data && request.images_data.length > 0) {
                for (let i = 0; i < request.images_data.length; i++) {
                    const newImageName = Math.random() + request.images_data[i].originalname;
                    yield Promise.all([
                        (0, baseAWS_1.uploadFile)(request.images_data[i].buffer, app_1.config.s3Bucket, request.images_data[i].mimetype, app_1.config.s3BucketForder + newImageName),
                        image_repository_1.ImageRepository.insert({
                            url: newImageName,
                            order: i,
                            book_id: bookSaved,
                        }),
                    ]);
                }
            }
        });
    }
    getList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield book_repository_1.BookRepository.getList(request);
            result.entities.forEach((item) => {
                const book_raw = result.raw.find((raw) => raw.book_id == item.id);
                item["rating_number"] = book_raw ? book_raw.rating_number : 0;
                if (item.avatar) {
                    item.avatar = (0, baseAWS_1.GetObjectURl)(item.avatar);
                }
                if (item.images && item.images.length > 0) {
                    item.images.forEach((img) => {
                        img.url = (0, baseAWS_1.GetObjectURl)(img.url);
                    });
                }
            });
            const total = yield book_repository_1.BookRepository.count();
            return {
                data: result.entities,
                total,
            };
        });
    }
    updateCategory(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield book_repository_1.BookRepository.findOneOrFail({
                where: {
                    id: request.book_id,
                },
                relations: { categories: true },
            });
            const categories = yield category_repository_1.CategoryRepository.find({
                where: { id: (0, typeorm_1.In)([...request.categories]) },
            });
            const invalidCategory = [];
            request.categories.forEach((id) => {
                const category = !categories.find((e) => e.id === id);
                if (category) {
                    invalidCategory.push(id);
                }
            });
            if (invalidCategory.length > 0) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `category id invalid`, {
                    invalidCategory,
                });
            }
            if (request.action === update_book_category_request_1.actionType.ADD) {
                book.categories.push(...categories);
                return book_repository_1.BookRepository.save(book);
            }
            if (request.action === update_book_category_request_1.actionType.DELETE) {
                categories.forEach((e) => {
                    book.categories = book.categories.filter((item) => item.id !== e.id);
                });
                return book_repository_1.BookRepository.save(book);
            }
        });
    }
    update(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield book_repository_1.BookRepository.findOneOrFail({
                where: { id: request.id },
                relations: { images: true, categories: true },
            });
            for (const key in book) {
                if (request.hasOwnProperty(key)) {
                    book[key] = request[key];
                }
            }
            let newAvartarName = "";
            let oldAvartarName = "";
            if (request.avatar_data[0]) {
                newAvartarName = Math.random() + request.avatar_data[0].originalname;
                oldAvartarName = book.avatar;
                book.avatar = newAvartarName;
            }
            if (request.images_data) {
                console.log(book.images.length);
                const limitImg = request.images_data.length + book.images.length;
                if (limitImg > 5) {
                    throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `Mỗi quấn sách chỉ có 5 ảnh, hãy xóa bớt để thêm vào, Còn trống ${5 - book.images.length}`);
                }
                for (const item of request.images_data) {
                    const imageTobeSaved = image_repository_1.ImageRepository.create();
                    const newImageName = Math.random() + item.originalname;
                    yield (0, baseAWS_1.uploadFile)(item.buffer, app_1.config.s3Bucket, item.mimetype, app_1.config.s3BucketForder + newImageName);
                    imageTobeSaved.url = newImageName;
                    imageTobeSaved.book_id = book;
                    imageTobeSaved.order = 1;
                    const image = yield image_repository_1.ImageRepository.save(imageTobeSaved);
                    book.images.push(image);
                }
            }
            yield book_repository_1.BookRepository.save(book);
            if (newAvartarName) {
                yield Promise.all([
                    oldAvartarName
                        ? (0, baseAWS_1.deleteObject)(app_1.config.s3Bucket, app_1.config.s3BucketForder + oldAvartarName)
                        : "",
                    (0, baseAWS_1.uploadFile)(request.avatar_data[0].buffer, app_1.config.s3Bucket, request.avatar_data[0].mimetype, app_1.config.s3BucketForder + newAvartarName),
                ]);
            }
        });
    }
    detail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield book_repository_1.BookRepository.findById(id);
            if (!result.entities[0])
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `book width id ${id} not found`);
            result.entities.forEach((item, index) => {
                item["rating_number"] = result.raw[index]["rating_number"] || 0;
                if (item.avatar) {
                    item.avatar = (0, baseAWS_1.GetObjectURl)(item.avatar);
                }
                if (item.images && item.images.length > 0) {
                    item.images.forEach((img) => {
                        img.url = (0, baseAWS_1.GetObjectURl)(img.url);
                    });
                }
            });
            return result.entities[0];
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield book_repository_1.BookRepository.findOneOrFail({ where: { id: id } });
            yield book_repository_1.BookRepository.delete({ id: book.id });
        });
    }
    delete_multiple(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.query && request.query.ids) {
                let ids = request.query.ids.split(",");
                const books = yield book_repository_1.BookRepository.find({ where: { id: (0, typeorm_1.In)(ids) } });
                if (books.length <= 0) {
                    throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `products width ids ${ids.toString()} not found`);
                }
                return book_repository_1.BookRepository.remove(books);
            }
            else {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
        });
    }
};
BookService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], BookService);
exports.BookService = BookService;
