import { config } from "@config/app";
import { AppDataSource } from "@config/db";
import { BillExport } from "@entity/bill-export.entity";
import { ListBillImportRequest } from "@models/bill_import/list-bill-import.request";
import { Sort } from "@models/sort";

export const BillExportRepository = AppDataSource.getRepository(
  BillExport
).extend({
  getList(request: ListBillImportRequest) {
    const take = request.limit || config.page.default_limit;
    const page = request.page || 1;
    const skip = (page - 1) * take;

    const query = this.createQueryBuilder("bill_export")
      .leftJoinAndSelect("bill_export.bill_export_detail", "bill_export_detail")
      .leftJoinAndSelect("bill_export.user", "user")
      .leftJoinAndSelect("bill_export_detail.book", "books");

    if (request.search) {
      query.where("user.name  LIKE :search ", {
        search: `%${request.search}%`,
      });
    }
    return query
      .orderBy("bill_export.created_at", Sort.DESC)
      .take(take)
      .skip(skip)
      .getManyAndCount();
  },
});
