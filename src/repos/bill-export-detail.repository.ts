import { AppDataSource } from "@config/db";
import { BillExportDetail } from "@entity/bill-export-detail.entity";

export const BillExportDetailRepository = AppDataSource.getRepository(
  BillExportDetail
).extend({
  //Tổng doanh thu -- tổng tiền bán đc
  total_revenue() {
    return this.createQueryBuilder("bill_export_detail")
      .innerJoin("bill_export_detail.book", "book")
      .select("SUM(book.price_export)", "sum_price_export")
      .getRawOne();
  },
});
