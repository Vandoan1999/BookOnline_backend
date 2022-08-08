"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillExportRepository = void 0;
const app_1 = require("@config/app");
const db_1 = require("@config/db");
const bill_export_entity_1 = require("@entity/bill-export.entity");
const role_enum_1 = require("@enums/role.enum");
const sort_1 = require("@models/sort");
exports.BillExportRepository = db_1.AppDataSource.getRepository(bill_export_entity_1.BillExport).extend({
    getList(request, user) {
        const take = request.limit || app_1.config.page.default_limit;
        const page = request.page || 1;
        const skip = (page - 1) * take;
        const query = this.createQueryBuilder("bill_export")
            .leftJoinAndSelect("bill_export.bill_export_detail", "bill_export_detail")
            .leftJoinAndSelect("bill_export.user", "user")
            .leftJoinAndSelect("bill_export_detail.book", "books");
        if (request.search) {
            query.where("books.name  LIKE :search ", {
                search: `%${request.search}%`,
            });
        }
        if (user.role === role_enum_1.Role.USER) {
            query.andWhere("bill_export.user_id = :user_id", { user_id: user.id });
        }
        return query
            .orderBy("bill_export.created_at", sort_1.Sort.DESC)
            .take(take)
            .skip(skip)
            .getManyAndCount();
    },
});
