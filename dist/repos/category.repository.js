"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const db_1 = require("@config/db");
const category_entity_1 = require("@entity/category.entity");
exports.CategoryRepository = db_1.AppDataSource.getRepository(category_entity_1.CategoryEntity).extend({});
