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
const testing_service_1 = require("@services/testing.service");
const express_1 = require("express");
const response_builder_1 = require("../ultis/response-builder");
const typedi_1 = require("typedi");
const router = (0, express_1.Router)();
const url = {
    test: "/",
};
router.get(url.test, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const testingService = typedi_1.Container.get(testing_service_1.TestingService);
    yield testingService.clear();
    res.json(new response_builder_1.ResponseBuilder().withSuccess().withMessage("clear data success").build());
}));
// Export default
exports.default = router;
