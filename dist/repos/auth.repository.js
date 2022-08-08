"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const user_entity_1 = require("@entity/user.entity");
const db_1 = require("@config/db");
exports.AuthRepository = db_1.AppDataSource.getRepository(user_entity_1.UserEntity).extend({
    getUserByName(username) {
        return this.createQueryBuilder("user").where("user.username = :username", { username: username }).addSelect("user.password").getOne();
    },
});
