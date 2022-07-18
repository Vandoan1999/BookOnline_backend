import { config } from "@config/app";
import { AppDataSource } from "@config/db";
import { BillImport } from "@entity/bill-import.entity";
import { ListBillImportRequest } from "@models/bill_import/list-bill-import.request";
import { Sort } from "@models/sort";

export const BillImportRepository = AppDataSource.getRepository(
  BillImport
).extend({
  getList(request: ListBillImportRequest) {
    const take = request.limit || config.page.default_limit;
    const page = request.page || 1;
    const skip = (page - 1) * take;

    const query = this.createQueryBuilder("bill_import")
      .leftJoinAndSelect(
        "bill_import.bill_import_details",
        "bill_import_details"
      )
      .leftJoinAndSelect("bill_import.supplier", "supplier")
      .leftJoinAndSelect("bill_import_details.book", "books");

    if (request.search) {
      query.where("supplier.name  LIKE :search ", {
        search: `%${request.search}%`,
      });
    }
    return query
      .orderBy("bill_import.created_at", Sort.DESC)
      .take(take)
      .skip(skip)
      .getManyAndCount();
  },
});
