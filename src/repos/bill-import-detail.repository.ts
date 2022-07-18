import { AppDataSource } from "@config/db";
import { BillImportDetail } from "@entity/bill-import-detail.entity";

export const BillImportDetailRepository = AppDataSource.getRepository(
  BillImportDetail
).extend({
  //tổng số tiền chi tiêu
  total_spending() {
    return this.createQueryBuilder("bill_import_detail")
      .innerJoin("bill_import_detail.book", "book")
      .select("SUM(book.price_import)", "sum_price_import")
      .getRawOne();
  },
});
