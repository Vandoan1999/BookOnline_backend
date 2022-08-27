"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillExportDetailRepository = void 0;
const db_1 = require("@config/db");
const bill_export_detail_entity_1 = require("@entity/bill-export-detail.entity");
exports.BillExportDetailRepository = db_1.AppDataSource.getRepository(bill_export_detail_entity_1.BillExportDetail).extend({});
