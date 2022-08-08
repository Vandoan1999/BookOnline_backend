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
const router = (0, express_1.Router)();
const url = {
    delete: "/:ids",
};
router.delete(url.delete, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageService = typedi_1.Container.get(image_service_1.ImageService);
    yield imageService.delete(req.params.ids);
    res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage(`Deleted image ${req.params.id} !`)
        .build());
}));
// Export default
exports.default = router;
