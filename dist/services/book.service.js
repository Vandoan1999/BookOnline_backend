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
const supplier_repository_1 = require("@repos/supplier.repository");
const category_repository_1 = require("@repos/category.repository");
const typeorm_1 = require("typeorm");
const db_1 = require("@config/db");
let BookService = class BookService {
    constructor() { }
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = book_repository_1.BookRepository.create(request);
            if (request.supplier_id) {
                const supplier = yield supplier_repository_1.SupplierRepository.findOne({
                    where: {
                        id: request.supplier_id,
                    },
                });
                if (!supplier)
                    throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST);
                book.supplier = supplier;
            }
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
            const bookSaved = yield book_repository_1.BookRepository.save(book);
            if (bookSaved && request.images_url && request.images_url.length > 0) {
                for (let i = 0; i < request.images_url.length; i++) {
                    yield image_repository_1.ImageRepository.insert({
                        url: request.images_url[i],
                        order: i,
                        book_id: bookSaved,
                    });
                }
            }
        });
    }
    getList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield book_repository_1.BookRepository.getList(request);
            result.entities.forEach((item) => {
                const book_raw = result.raw.find((raw) => raw.book_id == item.id);
                item["ratings_number"] = book_raw ? book_raw.rating_number : 0;
            });
            const total = yield book_repository_1.BookRepository.count();
            return {
                data: result.entities,
                total,
            };
        });
    }
    update(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield book_repository_1.BookRepository.findOne({
                where: { id: request.id },
                relations: { images: true, categories: true, supplier: true },
            });
            let imageToBeDeleted;
            let categoryToBeDelete;
            if (!book)
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `id ${request.id} book not found!`);
            if (request.image_delete && request.image_delete.length > 0) {
                for (let i = 0; i < request.image_delete.length; i++) {
                    imageToBeDeleted = yield image_repository_1.ImageRepository.findOne({
                        where: { id: request.image_delete[i] },
                    });
                    if (!imageToBeDeleted)
                        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `image to be deleted ${request.image_delete[i]} not found!`);
                    book.images = book.images.filter((image) => {
                        return image.id !== imageToBeDeleted.id;
                    });
                }
            }
            if (request.image_update && request.image_update.length > 0) {
                for (let i = 0; i < request.image_update.length; i++) {
                    const imageToBeSave = image_repository_1.ImageRepository.create(request.image_update[i]);
                    imageToBeSave.book_id = book;
                    const image = yield image_repository_1.ImageRepository.save(imageToBeSave);
                    book.images.push(image);
                }
            }
            if (request.category_delete) {
                for (let i = 0; i < request.category_delete.length; i++) {
                    categoryToBeDelete = yield category_repository_1.CategoryRepository.findOne({
                        where: { id: request.category_delete[i] },
                    });
                    if (!categoryToBeDelete) {
                        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `category to be deleted ${request.category_delete[i]} not found!`);
                    }
                    book.categories = book.categories.filter((category) => {
                        return category.id !== categoryToBeDelete.id;
                    });
                }
            }
            if (request.category_update) {
                for (let i = 0; i < request.category_update.length; i++) {
                    const categoryToBeSaved = yield category_repository_1.CategoryRepository.findOne({
                        where: { id: request.category_update[i] },
                    });
                    if (categoryToBeSaved) {
                        if (book.categories.some((cate) => cate.id === categoryToBeSaved.id)) {
                            throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `category to be update ${categoryToBeSaved.id} exited!`);
                        }
                        book.categories.push(categoryToBeSaved);
                    }
                }
            }
            if (request.supplier_update) {
                const supplier = yield supplier_repository_1.SupplierRepository.findOne({
                    where: { id: request.supplier_update },
                });
                if (supplier) {
                    book.supplier = supplier;
                }
            }
            for (const key in book) {
                if (request.hasOwnProperty(key)) {
                    book[key] = request[key];
                }
            }
            // return BookRepository.save(book);
            return db_1.AppDataSource.manager.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                yield book_repository_1.BookRepository.save(book);
                if (imageToBeDeleted)
                    yield image_repository_1.ImageRepository.delete(imageToBeDeleted);
                if (imageToBeDeleted)
                    yield image_repository_1.ImageRepository.delete(imageToBeDeleted);
            }));
        });
    }
    detail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield book_repository_1.BookRepository.findById(id);
            if (!result.entities[0])
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `product width id ${id} not found`);
            result.entities.forEach((item, index) => {
                item["rating_number"] = result.raw[index]["rating_number"] || 0;
            });
            return result.entities[0];
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield book_repository_1.BookRepository.delete({ id });
            return result;
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
