"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillImportRepository = void 0;
const app_1 = require("@config/app");
const db_1 = require("@config/db");
const bill_import_entity_1 = require("@entity/bill-import.entity");
const sort_1 = require("@models/sort");
exports.BillImportRepository = db_1.AppDataSource.getRepository(bill_import_entity_1.BillImport).extend({
    getList(request) {
        const take = request.limit || app_1.config.page.default_limit;
        const page = request.page || 1;
        const skip = (page - 1) * take;
        const query = this.createQueryBuilder("bill_import")
            .leftJoinAndSelect("bill_import.bill_import_details", "bill_import_details")
            .leftJoinAndSelect("bill_import.supplier", "supplier")
            .leftJoinAndSelect("bill_import_details.book", "books");
        if (request.search) {
            query.where("supplier.name  LIKE :search ", {
                search: `%${request.search}%`,
            });
        }
        return query
            .orderBy("bill_import.created_at", sort_1.Sort.DESC)
            .take(take)
            .skip(skip)
            .getManyAndCount();
    },
});
