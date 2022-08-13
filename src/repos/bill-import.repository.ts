import { config } from "@config/app";
import { AppDataSource } from "@config/db";
import { BillImport } from "@entity/bill-import.entity";
import { Order } from "@enums/order";
import { ListBillImportRequest } from "@models/bill_import/list-bill-import.request";

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
            if (item.text === Order.ASC || item.text === Order.DESC)
              query.orderBy("bill_import.quantity", item.text);
            break;

          case "created_at":
            if (item.text === Order.ASC || item.text === Order.DESC)
              query.orderBy("bill_import.created_at", item.text);
            break;
        }
      });
    }
    return query.take(take).skip(skip).getManyAndCount();
  },
});
