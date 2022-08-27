"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillImportRepository = void 0;
const app_1 = require("@config/app");
const db_1 = require("@config/db");
const bill_import_entity_1 = require("@entity/bill-import.entity");
const order_1 = require("@enums/order");
exports.BillImportRepository = db_1.AppDataSource.getRepository(bill_import_entity_1.BillImport).extend({
    getList(request) {
        const take = request.limit || app_1.config.page.default_limit;
        const page = request.page || 1;
        const skip = (page - 1) * take;
        const query = this.createQueryBuilder("bill_import")
            .leftJoinAndSelect("bill_import.bill_import_details", "bill_import_details")
            .leftJoinAndSelect("bill_import.supplier", "supplier")
            .leftJoinAndSelect("bill_import_details.book", "books");
        if (request.fillter) {
            const fillter = JSON.parse(request.fillter);
            fillter.forEach((item) => {
                switch (item.column) {
                    case "book_name":
                        query.andWhere("LOWER(books.name) LIKE LOWER(:book_name)", {
                            book_name: `%${item.text}%`,
                        });
                        break;
                    case "supplier_name":
                        query.andWhere("LOWER(books.name) LIKE LOWER(:supplier_name)", {
                            supplier_name: `%${item.text}%`,
                        });
                        break;
                    case "quantity":
                        if (item.text === order_1.Order.ASC || item.text === order_1.Order.DESC)
                            query.orderBy("bill_import.quantity", item.text);
                        break;
                    case "created_at":
                        if (item.text === order_1.Order.ASC || item.text === order_1.Order.DESC)
                            query.orderBy("bill_import.created_at", item.text);
                        break;
                }
            });
        }
        if (request.all || request.export) {
            return query.getManyAndCount();
        }
        return query.take(take).skip(skip).getManyAndCount();
    },
});
