"use strict";
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
const express_1 = require("express");
const response_builder_1 = require("../ultis/response-builder");
const typedi_1 = require("typedi");
const image_service_1 = require("@services/image.service");
const verify_token_1 = require("@middleware/verify-token");
const verify_user_1 = require("@middleware/verify-user");
const multer_1 = require("@common/multer");
const transformAndValidate_1 = require("../ultis/transformAndValidate");
const create_image_request_1 = require("@models/images/create-image.request");
const apiError_1 = require("../ultis/apiError");
const http_status_codes_1 = require("http-status-codes");
const update_image_request_1 = require("@models/images/update-image.request");
const router = (0, express_1.Router)();
const url = {
    delete: "/:ids",
    add: "/",
    update: "/",
};
router.delete(url.delete, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageService = typedi_1.Container.get(image_service_1.ImageService);
    yield imageService.delete(req.params.ids);
    res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage(`Deleted image ${req.params.ids} !`)
        .build());
}));
router.put(url.update, verify_token_1.verifyToken, verify_user_1.verifyUser, multer_1.upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(update_image_request_1.UpdateImageRequest, req.body);
    if (!req.file) {
        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `Image cannot be empty`);
    }
    request.image = req.file;
    const imageService = typedi_1.Container.get(image_service_1.ImageService);
    yield imageService.update(request);
    res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage(`Update image success!`)
        .build());
}));
router.post(url.add, verify_token_1.verifyToken, multer_1.upload.fields([
    {
        name: "images",
        maxCount: 5,
    },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(create_image_request_1.CreateImageRequest, req.body);
    const imageService = typedi_1.Container.get(image_service_1.ImageService);
    if (!req["files"]["images"] && req["files"]["images"].length == 0) {
        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `Images cannot be empty`);
    }
    request.images = req["files"]["images"];
    yield imageService.create(request);
    res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage("Create image success!")
        .build());
}));
// Export default
exports.default = router;
