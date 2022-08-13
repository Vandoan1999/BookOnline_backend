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
const http_status_codes_1 = require("http-status-codes");
const apiError_1 = require("../ultis/apiError");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const image_type_enum_1 = require("@enums/image-type.enum");
const image_entity_1 = require("@entity/image.entity");
const jet_logger_1 = __importDefault(require("jet-logger"));
const image_table_name_enum_1 = require("@enums/image-table-name.enum");
const book_repository_1 = require("@repos/book.repository");
const category_repository_1 = require("@repos/category.repository");
const user_repository_1 = require("@repos/user.repository");
let ImageService = class ImageService {
    constructor() { }
    update(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageToBeSaved = yield image_repository_1.ImageRepository.findOneByOrFail({
                id: request.id,
            });
            const oldImage = imageToBeSaved.url;
            const tableName = oldImage.split("-")[0];
            imageToBeSaved.url = this.generateNameImage(tableName, request.image["originalname"]);
            jet_logger_1.default.info(`Start updating images to db!`);
            yield image_repository_1.ImageRepository.save(imageToBeSaved);
            jet_logger_1.default.info(`Updated the photo!`);
            jet_logger_1.default.info(`Start deleting old photos from s3`);
            yield (0, baseAWS_1.deleteObject)(app_1.config.s3Bucket, app_1.config.s3BucketForder + oldImage);
            jet_logger_1.default.info(`Deleted deleted old photos from s3`);
            jet_logger_1.default.info(`Start uploading new photos to s3`);
            yield (0, baseAWS_1.uploadFile)(request.image.buffer, app_1.config.s3Bucket, request.image.mimetype, app_1.config.s3BucketForder + imageToBeSaved.url);
            jet_logger_1.default.info(`uploaded a new photo to s3`);
        });
    }
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageToBeSave = [];
            const imageToBeUploadS3 = [];
            let item;
            let totalImage;
            let totalAvartar;
            switch (request.tableName) {
                case image_table_name_enum_1.ImageTableName.books:
                    item = yield book_repository_1.BookRepository.findOneByOrFail({ id: request.item_id });
                    totalImage = yield image_repository_1.ImageRepository.countBy({
                        item_id: request.item_id,
                        type: image_type_enum_1.ImageType.image,
                    });
                    totalAvartar = yield image_repository_1.ImageRepository.countBy({
                        item_id: request.item_id,
                        type: image_type_enum_1.ImageType.avartar,
                    });
                    if (request.type === image_type_enum_1.ImageType.avartar && totalAvartar >= 1) {
                        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `book id ${request.item_id} has more than 1 avartar`);
                    }
                    if (request.type === image_type_enum_1.ImageType.image && totalImage >= 5) {
                        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `book id ${request.item_id} has more than 5 image`);
                    }
                    break;
                case image_table_name_enum_1.ImageTableName.categories:
                    item = yield category_repository_1.CategoryRepository.findOneByOrFail({
                        id: request.item_id,
                    });
                    totalImage = yield image_repository_1.ImageRepository.countBy({
                        item_id: request.item_id,
                        type: image_type_enum_1.ImageType.image,
                    });
                    if (request.type !== image_type_enum_1.ImageType.image) {
                        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `category id ${request.item_id} only update image`);
                    }
                    if (totalImage >= 1) {
                        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `category id ${request.item_id} has more than 1 image`);
                    }
                    break;
                case image_table_name_enum_1.ImageTableName.users:
                    item = yield user_repository_1.UserRepository.findOneByOrFail({ id: request.item_id });
                    totalImage = yield image_repository_1.ImageRepository.countBy({
                        item_id: request.item_id,
                        type: image_type_enum_1.ImageType.image,
                    });
                    if (request.type !== image_type_enum_1.ImageType.image) {
                        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `user id ${request.item_id} only update image`);
                    }
                    if (totalImage >= 1) {
                        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `user id ${request.item_id} has more than 1 image`);
                    }
                    break;
                default:
                    item = null;
                    break;
            }
            if (!item) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `item id ${request.item_id} invalid`);
            }
            if (request.type === image_type_enum_1.ImageType.image) {
                for (const image of request.images) {
                    const newImageName = this.generateNameImage(request.tableName, image.originalname);
                    const img = new image_entity_1.ImageEntity();
                    img.item_id = request.item_id;
                    img.url = newImageName;
                    img.type = request.type;
                    imageToBeSave.push(img);
                    imageToBeUploadS3.push((0, baseAWS_1.uploadFile)(image.buffer, app_1.config.s3Bucket, image.mimetype, app_1.config.s3BucketForder + newImageName));
                }
                const res = yield image_repository_1.ImageRepository.save(imageToBeSave);
                for (const img of res) {
                    jet_logger_1.default.info(`create images ! ${JSON.stringify(img)} !`);
                }
                yield Promise.all(imageToBeUploadS3);
                jet_logger_1.default.info(`uploaded images to s3 done! `);
            }
            if (request.type === image_type_enum_1.ImageType.avartar) {
                const imageToBeSave = request.images[0];
                const newImageName = this.generateNameImage(request.tableName, imageToBeSave.originalname);
                const img = new image_entity_1.ImageEntity();
                img.item_id = request.item_id;
                img.url = newImageName;
                img.type = request.type;
                const res = yield image_repository_1.ImageRepository.save(img);
                jet_logger_1.default.info(`created images ! ${JSON.stringify(res)} !`);
                yield (0, baseAWS_1.uploadFile)(imageToBeSave.buffer, app_1.config.s3Bucket, imageToBeSave.mimetype, app_1.config.s3BucketForder + newImageName);
                jet_logger_1.default.info(`upload images to s3 suucess ! ${JSON.stringify(res)}`);
            }
        });
    }
    delete(ids = null, objectIds = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let arrId;
            let image;
            if (ids) {
                arrId = ids.split(",");
                image = yield image_repository_1.ImageRepository.find({
                    where: { id: (0, typeorm_1.In)([...arrId]) },
                });
            }
            if (objectIds) {
                arrId = objectIds.split(",");
                image = yield image_repository_1.ImageRepository.find({
                    where: { item_id: (0, typeorm_1.In)([...arrId]) },
                });
            }
            const invalidImg = [];
            for (const id of arrId) {
                if (ids) {
                    const invalidItem = !image.find((item) => item.id === id);
                    if (invalidItem) {
                        invalidImg.push(id);
                    }
                }
                if (objectIds) {
                    const invalidItem = !image.find((item) => item.item_id === id);
                    if (invalidItem) {
                        invalidImg.push(id);
                    }
                }
            }
            if (invalidImg.length > 0) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `images invalid`, {
                    invalidImg,
                });
            }
            jet_logger_1.default.info(`Start deleting photos from the database!`);
            yield image_repository_1.ImageRepository.delete({ id: (0, typeorm_1.In)([...arrId]) });
            jet_logger_1.default.info(`Deleted photos from database !`);
            const promiseAll = [];
            for (const { url } of image) {
                promiseAll.push((0, baseAWS_1.deleteObject)(app_1.config.s3Bucket, app_1.config.s3BucketForder + url));
            }
            jet_logger_1.default.info(`Start deleting photos from s3! `);
            yield Promise.all(promiseAll);
            jet_logger_1.default.info(`Deleted photos from s3! `);
        });
    }
    generateNameImage(tableName, originalname) {
        return `${tableName}-${Math.floor(Math.random() * 100000)}-${originalname.replace("-", "")}`;
    }
    getImageByObject(objects) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = objects.map((item) => item.id);
            const images = yield image_repository_1.ImageRepository.find({
                where: { item_id: (0, typeorm_1.In)([...ids]) },
            });
            for (const object of objects) {
                const image = images
                    .filter((i) => i.item_id === object.id && i.type === image_type_enum_1.ImageType.image)
                    .map((i) => {
                    return Object.assign(Object.assign({}, i), { link: (0, baseAWS_1.GetObjectURl)(i.url) });
                });
                const avatar = images.find((i) => i.item_id === object.id && i.type === image_type_enum_1.ImageType.avartar);
                if (image.length === 0) {
                    object["images"] = [];
                }
                else {
                    object["images"] = image;
                }
                if (avatar) {
                    object["avartar"] = Object.assign(Object.assign({}, avatar), { link: (0, baseAWS_1.GetObjectURl)(avatar.url) });
                }
                else {
                    object["avartar"] = "";
                }
            }
            return objects;
        });
    }
};
ImageService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ImageService);
exports.ImageService = ImageService;
