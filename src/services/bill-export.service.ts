import { Service } from "typedi";
import { BookEntity } from "@entity/book.entity";
import { AppDataSource } from "@config/db";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { MoreThanOrEqual } from "typeorm";
import { CreateBillExportRequest } from "@models/bill_export/create-bill-export.request";
import { UserEntity } from "@entity/user.entity";
import { BillExportRepository } from "@repos/bill-export.repository";
import { BillExportDetailRepository } from "@repos/bill-export-detail.repository";
import { UserInfo } from "@models/user/UserInfo";
import { ListBillExportRequest } from "@models/bill_export/list-bill-export.request";
import { UserRepository } from "@repos/user.repository";
import { BookRepository } from "@repos/book.repository";
import { Role } from "@enums/role.enum";

require("dotenv").config();
@Service()
export class BillExportService {
  constructor() {}
  async create(request: CreateBillExportRequest, userInfo: UserInfo) {
    request.user_id = userInfo.id;
    const user = await UserRepository.findOneByOrFail({
      id: request.user_id,
    });
    const booksPromise: Promise<BookEntity>[] = [];
    for (const bookRequest of request.books) {
      booksPromise.push(
        BookRepository.findOneByOrFail({
          id: bookRequest.id,
        })
      );
    }
    const books = await Promise.all(booksPromise);
    if (!user.address || !user.phone) {
      if (userInfo.role === Role.USER)
        throw ApiError(
          StatusCodes.BAD_REQUEST,
          `address and phone must of user ${user.username} is empty, you must update address and phone to buying book `
        );
    }
    const bill_export_instance = BillExportRepository.create();
    bill_export_instance.user = user;
    const bill_export = await BillExportRepository.save(bill_export_instance);
    for (const book of books) {
      const bookRequest = request.books.find((item) => item.id === book.id)!;
      if (book.quantity < bookRequest.quantity) {
        throw ApiError(
          StatusCodes.BAD_REQUEST,
          `Quanlity of book ${book.id} with quality ${book.quantity} not enough: book Inventory = ${book.quantity} | book request = ${bookRequest.quantity}`
        );
      }
      const bill_export_detail = BillExportDetailRepository.create();
      bill_export_detail.book_id = book.id;
      bill_export_detail.quantity = bookRequest.quantity;
      bill_export_detail.bill_export_id = bill_export.id;
      book.quantity -= bookRequest.quantity;
      book.sold -= bookRequest.quantity;
      await BillExportDetailRepository.insert(bill_export_detail);
      await BookRepository.save(book);
    }
  }

  list(request: ListBillExportRequest, user: UserInfo) {
    return BillExportRepository.getList(request, user);
  }

  async delete(id: string) {
    if (id) {
      return BillExportRepository.delete({ id });
    }
  }

  async init() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const res = await Promise.all([
      BillExportDetailRepository.count(),
      BillExportDetailRepository.countBy({ created_at: MoreThanOrEqual(date) }),
    ]);
    return {
      totalBill: res[0],
      totalBillInCurrentDate: res[1],
    };
  }
}
