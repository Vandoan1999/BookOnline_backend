"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillExportRepository = void 0;
const app_1 = require("@config/app");
const db_1 = require("@config/db");
const bill_export_entity_1 = require("@entity/bill-export.entity");
const order_1 = require("@enums/order");
const role_enum_1 = require("@enums/role.enum");
const bill_export_status_enum_1 = require("@models/bill_export/bill-export-status.enum");
exports.BillExportRepository = db_1.AppDataSource.getRepository(bill_export_entity_1.BillExport).extend({
    getList(request, user) {
        const take = request.limit || app_1.config.page.default_limit;
        const page = request.page || 1;
        const skip = (page - 1) * take;
        const query = this.createQueryBuilder("bill_export")
            .leftJoinAndSelect("bill_export.bill_export_detail", "bill_export_detail")
            .leftJoinAndSelect("bill_export.user", "user")
            .leftJoinAndSelect("bill_export_detail.book", "books");
        if (request.fillter) {
            const fillter = JSON.parse(request.fillter);
            fillter.forEach((item) => {
                switch (item.column) {
                    case "name":
                        query.andWhere("LOWER(books.name) LIKE LOWER(:name)", {
                            name: `%${item.text}%`,
                        });
                        break;
                    case "status":
                        item.text = Number(item.text);
                        if (Object.values(bill_export_status_enum_1.BillExportStatus).includes(item.text)) {
                            query.andWhere("bill_export.status = :status", {
                                status: `%${item.text}%`,
                            });
                        }
                        break;
                    case "quantity":
                        if (item.text === order_1.Order.ASC || item.text === order_1.Order.DESC)
                            query.orderBy("bill_export.quantity", item.text);
                        break;
                    case "created_at":
                        if (item.text === order_1.Order.ASC || item.text === order_1.Order.DESC)
                            query.orderBy("bill_export.created_at", item.text);
                        break;
                }
            });
        }
        if (user.role === role_enum_1.Role.USER) {
            query.andWhere("bill_export.user_id = :user_id", { user_id: user.id });
        }
        if (request.all || request.export) {
            return query.getManyAndCount();
        }
        return query.take(take).skip(skip).getManyAndCount();
    },
    fileOne(id, user) {
        const query = this.createQueryBuilder("bill_export")
            .leftJoinAndSelect("bill_export.bill_export_detail", "bill_export_detail")
            .leftJoinAndSelect("bill_export.user", "user")
            .leftJoinAndSelect("bill_export_detail.book", "books")
            .andWhere("bill_export.id = :id", { id });
        if (user.role === role_enum_1.Role.USER) {
            query.andWhere("bill_export.user_id = :user_id", { user_id: user.id });
        }
        return query.getOne();
    },
    total_revenue() {
        return this.createQueryBuilder("bill_exportx")
            .innerJoin("bill_exportx.bill_export_detail", "bill_export_detail")
            .innerJoin("bill_export_detail.book", "book")
            .select([
            "SUM(book.price_export * bill_export_detail.quantity) as sum_price_export",
            "SUM((book.price_export - book.price_import) * bill_export_detail.quantity) as sum_profit",
        ])
            .where("bill_exportx.status = :status", {
            status: bill_export_status_enum_1.BillExportStatus.delivered,
        })
            .getRawOne();
    },
});
