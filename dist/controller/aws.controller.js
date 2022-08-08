"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const express_1 = require("express");
const response_builder_1 = require("../ultis/response-builder");
const AWS = __importStar(require("aws-sdk"));
const multer_1 = require("@common/multer");
const router = (0, express_1.Router)();
const url = {
    get: "/",
};
const s3 = new AWS.S3({});
router.post(url.get, multer_1.upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketParams = {
        Body: req.file.buffer,
        Bucket: "shopbook",
        ContentType: req.file.mimetype,
        Key: `images/${req.file.originalname}`,
    };
    yield s3.putObject(bucketParams).promise();
    res.json(new response_builder_1.ResponseBuilder().withSuccess().build());
}));
router.get(url.get, multer_1.upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketParams = {
        Bucket: "shopbook",
        Key: `images/0.922810108853827demo.png`,
    };
    const result = yield s3.headObject(bucketParams).promise();
    console.log(result);
    const result1 = yield s3.deleteObject(bucketParams).promise();
    console.log(result1);
    res.json(new response_builder_1.ResponseBuilder().withSuccess().build());
}));
router.delete(url.get, multer_1.upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketParams = {
        Bucket: "shopbook",
        Key: `images/demo.png`,
    };
    yield s3.deleteObject(bucketParams).promise();
    res.json(new response_builder_1.ResponseBuilder().withSuccess().build());
}));
exports.default = router;
