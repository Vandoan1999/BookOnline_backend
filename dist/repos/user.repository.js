"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const app_1 = require("@config/app");
const db_1 = require("@config/db");
const user_entity_1 = require("@entity/user.entity");
const role_enum_1 = require("@enums/role.enum");
const gender_enum_1 = require("@enums/gender.enum");
const order_1 = require("@enums/order");
exports.UserRepository = db_1.AppDataSource.getRepository(user_entity_1.UserEntity).extend({
    getList(request) {
        const take = request.limit || app_1.config.page.default_limit;
        const page = request.page || 1;
        const skip = (page - 1) * take;
        const query = this.createQueryBuilder("user");
        if (request.fillter) {
            const fillter = JSON.parse(request.fillter);
            fillter.forEach((item) => {
                switch (item.column) {
                    case "username":
                        query.andWhere("LOWER(user.username) LIKE LOWER(:username)", {
                            username: `%${item.text}%`,
                        });
                        break;
                    case "email":
                        query.andWhere("user.email LIKE :email", {
                            email: `%${item.text}%`,
                        });
                        break;
                    case "role":
                        if (role_enum_1.Role.ADMIN === item.text || role_enum_1.Role.USER == item.text)
                            query.andWhere("user.role = :role", {
                                role: `${item.text}`,
                            });
                        break;
                    case "sex":
                        if (gender_enum_1.Gender.FEMALE === Number(item.text) ||
                            gender_enum_1.Gender.MALE === Number(item.text)) {
                            query.andWhere("user.sex = :sex", {
                                role: `${Number(item.text)}`,
                            });
                        }
                        break;
                    case "address":
                        query.andWhere("user.address LIKE :address", {
                            address: `%${item.text}%`,
                        });
                        break;
                    case "fullName":
                        query.andWhere("user.fullName LIKE :fullName", {
                            fullName: `%${item.text}%`,
                        });
                        break;
                    case "phone":
                        query.andWhere("user.phone LIKE :phone", {
                            phone: `%${item.text}%`,
                        });
                        break;
                    case "bank":
                        query.andWhere("user.bank LIKE :bank", {
                            bank: `%${item.text}%`,
                        });
                    case "is_active":
                        if (item.text === "true" || item.text === "false") {
                            item.text = item.text === "true" ? true : false;
                            query.andWhere("user.is_active = :is_active", {
                                is_active: `${item.text}`,
                            });
                        }
                        break;
                    case "created_at":
                        if (item.text === order_1.Order.ASC || item.text === order_1.Order.DESC)
                            query.orderBy("book.created_at", item.text);
                        break;
                }
            });
        }
        return query.take(take).skip(skip).getManyAndCount();
    },
    totalCustomer() {
        return this.createQueryBuilder("user")
            .select("COUNT(user.id)", "total_user")
            .where("user.role = :role", { role: role_enum_1.Role.USER })
            .getRawOne();
    },
});
