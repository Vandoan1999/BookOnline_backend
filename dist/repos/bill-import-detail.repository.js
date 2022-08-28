"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillImportDetailRepository = void 0;
const db_1 = require("@config/db");
const bill_import_detail_entity_1 = require("@entity/bill-import-detail.entity");
exports.BillImportDetailRepository = db_1.AppDataSource.getRepository(bill_import_detail_entity_1.BillImportDetail).extend({
    //tổng số tiền chi tiêu
    total_spending() {
        return this.createQueryBuilder("bill_import_detail")
            .innerJoin("bill_import_detail.book", "book")
            .select("SUM(book.price_import * bill_import_detail.quantity)", "sum_price_import")
            .getRawOne();
    },
});
