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
exports.ImageService = void 0;
const baseAWS_1 = require("@common/baseAWS");
const app_1 = require("@config/app");
const image_repository_1 = require("@repos/image.repository");
const http_status_codes_1 = require("http-status-codes");
const apiError_1 = require("src/ultis/apiError");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
let ImageService = class ImageService {
    constructor() { }
    update(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield image_repository_1.ImageRepository.update({
                id: request.id,
            }, {
                url: request.url + "/",
            });
        });
    }
    delete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const arrId = ids.split(",");
            const image = yield image_repository_1.ImageRepository.find({
                where: { id: (0, typeorm_1.In)([...arrId]) },
            });
            const invalidImg = [];
            for (const id of arrId) {
                const invalidItem = !image.find((item) => item.id === id);
                if (invalidItem) {
                    invalidImg.push(id);
                }
            }
            if (invalidImg.length > 0) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `images invalid`, {
                    invalidImg,
                });
            }
            yield image_repository_1.ImageRepository.delete({ id: (0, typeorm_1.In)([...arrId]) });
            const promiseAll = [];
            console.log(image);
            for (const { url } of image) {
                promiseAll.push((0, baseAWS_1.deleteObject)(app_1.config.s3Bucket, app_1.config.s3BucketForder + url));
            }
            yield Promise.all(promiseAll);
        });
    }
};
ImageService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ImageService);
exports.ImageService = ImageService;
