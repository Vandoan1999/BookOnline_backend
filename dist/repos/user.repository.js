"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const app_1 = require("@config/app");
const db_1 = require("@config/db");
const user_entity_1 = require("@entity/user.entity");
const orderBy_enum_1 = require("@models/user/orderBy.enum");
exports.UserRepository = db_1.AppDataSource.getRepository(user_entity_1.UserEntity).extend({
    getList(request) {
        const take = request.limit || app_1.config.page.default_limit;
        const page = request.page || 1;
        const skip = (page - 1) * take;
        const query = this.createQueryBuilder("user");
        if (request.search) {
            query.where("user.name LIKE :name", { name: `%${request.search}%` });
        }
        if (request.orderBy === orderBy_enum_1.OrderByEnum.email) {
            query.orderBy("user.email", request.order);
        }
        else if (request.orderBy === orderBy_enum_1.OrderByEnum.username) {
            query.orderBy("user.username", request.order);
        }
        else {
            query.orderBy("user.email", "ASC");
        }
        return query.take(take).skip(skip).getManyAndCount();
    },
});
