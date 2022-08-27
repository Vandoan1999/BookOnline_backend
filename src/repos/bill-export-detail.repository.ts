import { AppDataSource } from "@config/db";
import { BillExportDetail } from "@entity/bill-export-detail.entity";

export const BillExportDetailRepository = AppDataSource.getRepository(
  BillExportDetail
).extend({});
