import { config } from "@config/app";
import { AppDataSource } from "@config/db";
import { BillExport } from "@entity/bill-export.entity";
import { Order } from "@enums/order";
import { Role } from "@enums/role.enum";
import { BillExportStatus } from "@models/bill_export/bill-export-status.enum";
import { ListBillExportRequest } from "@models/bill_export/list-bill-export.request";
import { UserInfo } from "@models/user/UserInfo";

export const BillExportRepository = AppDataSource.getRepository(
  BillExport
).extend({
  getList(request: ListBillExportRequest, user: UserInfo) {
    const take = request.limit || config.page.default_limit;
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
            if (Object.values(BillExportStatus).includes(item.text)) {
              query.andWhere("bill_export.status = :status", {
                status: `%${item.text}%`,
              });
            }
            break;

          case "quantity":
            if (item.text === Order.ASC || item.text === Order.DESC)
              query.orderBy("bill_export.quantity", item.text);
            break;

          case "created_at":
            if (item.text === Order.ASC || item.text === Order.DESC)
              query.orderBy("bill_export.created_at", item.text);
            break;
        }
      });
    }
    if (user.role === Role.USER) {
      query.andWhere("bill_export.user_id = :user_id", { user_id: user.id });
    }
    if (request.all || request.export) {
      return query.getManyAndCount();
    }
    return query.take(take).skip(skip).getManyAndCount();
  },

  getBill(ids: string[]) {
    const query = this.createQueryBuilder("bill_export")
      .leftJoinAndSelect("bill_export.bill_export_detail", "bill_export_detail")
      .leftJoinAndSelect("bill_export.user", "user")
      .leftJoinAndSelect("bill_export_detail.book", "books")
      .select([
        "user.id",
        "count(bill_export.id)",
        "sum(bill_export_detail.quantity * books.price_export)",
      ])
      .where("user.id IN (:...ids)", { ids: [...ids] })
      .groupBy("user.id");
    return query.getRawMany();
  },

  fileOne(id: string, user: UserInfo) {
    const query = this.createQueryBuilder("bill_export")
      .leftJoinAndSelect("bill_export.bill_export_detail", "bill_export_detail")
      .leftJoinAndSelect("bill_export.user", "user")
      .leftJoinAndSelect("bill_export_detail.book", "books")
      .andWhere("bill_export.id = :id", { id });

    if (user.role === Role.USER) {
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
        status: BillExportStatus.delivered,
      })
      .getRawOne();
  },

  total_bill_pending() {
    return this.createQueryBuilder("bill_exportx")
      .select("Count(bill_exportx.id) as total")
      .where("bill_exportx.status = :status", {
        status: BillExportStatus.Pending,
      })
      .getRawOne();
  },

  total_bill_confirmed() {
    return this.createQueryBuilder("bill_exportx")
      .select("Count(bill_exportx.id) as total")
      .where("bill_exportx.status = :status", {
        status: BillExportStatus.Confirmed,
      })
      .getRawOne();
  },

  total_bill_rejected() {
    return this.createQueryBuilder("bill_exportx")
      .select("Count(bill_exportx.id) as total")
      .where("bill_exportx.status = :status", {
        status: BillExportStatus.Reject,
      })
      .getRawOne();
  },

  total_bill_delivered() {
    return this.createQueryBuilder("bill_exportx")
      .select("Count(bill_exportx.id) as total")
      .where("bill_exportx.status = :status", {
        status: BillExportStatus.delivered,
      })
      .getRawOne();
  },
});
