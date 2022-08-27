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
exports.ImageService = void 0;
const baseAWS_1 = require("@common/baseAWS");
const app_1 = require("@config/app");
const image_repository_1 = require("@repos/image.repository");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const jet_logger_1 = __importDefault(require("jet-logger"));
let ImageService = class ImageService {
    constructor() { }
    update(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageToBeSaved = yield image_repository_1.ImageRepository.findOneByOrFail({
                id: request.id,
            });
            const nameImageOld = imageToBeSaved.link.replace(app_1.config.s3Url, "");
            const nameImageNew = this.generateNameImage(`image-${new Date().toLocaleTimeString()}`);
            imageToBeSaved.link = app_1.config.s3Url + nameImageNew;
            yield image_repository_1.ImageRepository.save(imageToBeSaved);
            yield (0, baseAWS_1.deleteObject)(app_1.config.s3Bucket, app_1.config.s3BucketForder + nameImageOld);
            jet_logger_1.default.info(`Deleted deleted old photos from s3`);
            yield (0, baseAWS_1.uploadFile)(request.image.buffer, app_1.config.s3Bucket, request.image.mimetype, app_1.config.s3BucketForder + nameImageNew);
            jet_logger_1.default.info(`uploaded a new photo to s3`);
        });
    }
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const promiseAllUploadFileToS3 = [];
            const imageToBeSave = [];
            for (const image of request.images) {
                const imageName = this.generateNameImage(`image-${new Date().toLocaleTimeString()}`);
                promiseAllUploadFileToS3.push((0, baseAWS_1.uploadFile)(image.buffer, app_1.config.s3Bucket, image.mimetype, app_1.config.s3BucketForder + imageName));
                imageToBeSave.push({ link: app_1.config.s3Url + imageName });
            }
            jet_logger_1.default.info(`Upload images to s3`);
            yield Promise.all(promiseAllUploadFileToS3);
            jet_logger_1.default.info(`Upload images to done`);
            return image_repository_1.ImageRepository.save(imageToBeSave);
        });
    }
    delete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const images = yield image_repository_1.ImageRepository.find({ where: { id: (0, typeorm_1.In)(ids) } });
            yield image_repository_1.ImageRepository.remove(images);
            const imageTobeDeleteS3 = [];
            for (const img of images) {
                const nameImageOld = img.link.replace(app_1.config.s3Url, "");
                imageTobeDeleteS3.push((0, baseAWS_1.deleteObject)(app_1.config.s3Bucket, app_1.config.s3BucketForder + nameImageOld));
            }
            yield Promise.all(imageTobeDeleteS3);
        });
    }
    generateNameImage(originalname) {
        return `${Math.floor(Math.random() * 100000)}-${originalname}`;
    }
};
ImageService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ImageService);
exports.ImageService = ImageService;
