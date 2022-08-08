"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRepository = void 0;
const db_1 = require("@config/db");
const image_entity_1 = require("@entity/image.entity");
exports.ImageRepository = db_1.AppDataSource.getRepository(image_entity_1.ImageEntity).extend({});
