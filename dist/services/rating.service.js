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
exports.RatingService = void 0;
const book_repository_1 = require("@repos/book.repository");
const user_repository_1 = require("@repos/user.repository");
const apiError_1 = require("../ultis/apiError");
const typedi_1 = require("typedi");
const http_status_codes_1 = require("http-status-codes");
const rating_repository_1 = require("@repos/rating.repository");
const image_service_1 = require("./image.service");
let RatingService = class RatingService {
    constructor(imageService) {
        this.imageService = imageService;
    }
    getListRating(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rating, total] = yield rating_repository_1.RatingRepository.getListRating(request);
            for (const r of rating) {
                const user = yield this.imageService.getImageByObject([r.user]);
                r.user = user[0];
            }
            return {
                rating,
                total,
            };
        });
    }
    createOrUpdate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repository_1.UserRepository.findOne({
                where: { id: request.user_id },
            });
            const book = yield book_repository_1.BookRepository.findOne({
                where: { id: request.book_id },
            });
            if (!user) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, "user not found!");
            }
            if (!book) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, "book not found!");
            }
            const rating = yield rating_repository_1.RatingRepository.findOne({
                where: { book_id: book.id, user_id: user.id },
            });
            if (!rating) {
                const ratingToBeSaved = rating_repository_1.RatingRepository.create();
                ratingToBeSaved.user = user;
                ratingToBeSaved.book = book;
                ratingToBeSaved.content = request.content;
                ratingToBeSaved.rating_number = request.rating_number;
                yield rating_repository_1.RatingRepository.save(ratingToBeSaved);
                if (book.total_rating === 0) {
                    book.rating_number = request.rating_number;
                    book.total_rating += 1;
                }
                else {
                    const newRatingNumber = (book.rating_number * book.total_rating + request.rating_number) /
                        (book.total_rating + 1);
                    book.rating_number = newRatingNumber;
                    book.total_rating += 1;
                }
                yield book_repository_1.BookRepository.save(book);
                return "Create a successful rating";
            }
            else {
                let ratingNumberChanged = rating.rating_number - request.rating_number;
                rating.content = request.content;
                rating.rating_number = request.rating_number;
                if (ratingNumberChanged > 0) {
                    const newRatingNumber = (book.rating_number * book.total_rating - ratingNumberChanged) /
                        book.total_rating;
                    book.rating_number = newRatingNumber;
                    yield rating_repository_1.RatingRepository.save(rating);
                    yield book_repository_1.BookRepository.save(book);
                    return "Update a successful rating";
                }
                if (ratingNumberChanged < 0) {
                    const newRatingNumber = (book.rating_number * book.total_rating - ratingNumberChanged) /
                        book.total_rating;
                    book.rating_number = newRatingNumber;
                    yield rating_repository_1.RatingRepository.save(rating);
                    yield book_repository_1.BookRepository.save(book);
                    return "Update a successful rating";
                }
                return "has no change";
            }
        });
    }
    delete(book_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield book_repository_1.BookRepository.findOneOrFail({
                where: { id: book_id },
            });
            const rating = yield rating_repository_1.RatingRepository.findOneOrFail({
                where: { book_id: book_id, user_id: user_id },
            });
            const newRatingNumber = (book.rating_number * book.total_rating - rating.rating_number) /
                (book.total_rating - 1);
            book.rating_number = newRatingNumber;
            book.total_rating -= 1;
            yield rating_repository_1.RatingRepository.delete({
                book_id: rating.book_id,
                user_id: rating.user_id,
            });
        });
    }
};
RatingService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [image_service_1.ImageService])
], RatingService);
exports.RatingService = RatingService;
