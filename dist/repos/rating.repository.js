"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingRepository = void 0;
const db_1 = require("@config/db");
const rating_entity_1 = require("@entity/rating.entity");
exports.RatingRepository = db_1.AppDataSource.getRepository(rating_entity_1.RatingEntity).extend({});
