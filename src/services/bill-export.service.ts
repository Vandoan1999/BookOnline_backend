import { Service } from "typedi";
import { BookEntity } from "@entity/book.entity";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { In, MoreThanOrEqual } from "typeorm";
import { CreateBillExportRequest } from "@models/bill_export/create-bill-export.request";
import { BillExportRepository } from "@repos/bill-export.repository";
import { BillExportDetailRepository } from "@repos/bill-export-detail.repository";
import { UserInfo } from "@models/user/UserInfo";
import { ListBillExportRequest } from "@models/bill_export/list-bill-export.request";
import { UserRepository } from "@repos/user.repository";
import { BookRepository } from "@repos/book.repository";
import { ImageService } from "./image.service";
import { UpdateBillExportRequest } from "@models/bill_export/update-bill-export.request";
import { BillExportStatus } from "@models/bill_export/bill-export-status.enum";
require("dotenv").config();
@Service()
export class BillExportService {
  constructor(private imageService: ImageService) {}
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
      // book.quantity -= bookRequest.quantity;
      // book.sold += bookRequest.quantity;
      // await BookRepository.save(book);
      return BillExportDetailRepository.insert(bill_export_detail);
    }
  }

  async list(request: ListBillExportRequest, user: UserInfo) {
    const [billExport, total] = await BillExportRepository.getList(
      request,
      user
    );
    for (let bill of billExport) {
      if (bill.user.avartar) {
        bill.user.avartar = JSON.parse(bill.user.avartar);
      }
      for (const bxd of bill.bill_export_detail) {
        if (bxd.book.images) {
          bxd.book.images = JSON.parse(bxd.book.images);
        }

        if (bxd.book.avartar) {
          bxd.book.avartar = JSON.parse(bxd.book.avartar);
        }
      }
    }

    return {
      billExport,
      total,
    };
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

  async update(request: UpdateBillExportRequest, userinfo: UserInfo) {
    const billExport = await BillExportRepository.findOneOrFail({
      where: { id: request.id },
      relations: ["bill_export_detail"],
    });
    if (
      request.status &&
      Object.values(BillExportStatus).includes(request.status)
    ) {
      if (billExport.bill_export_detail.length > 0) {
        if (billExport.status === BillExportStatus.Pending) {
          const books = await BookRepository.find({
            where: {
              id: In([...billExport.bill_export_detail.map((i) => i.book_id)]),
            },
          });
          const booksToBeUpdated: any[] = [];
          for (const { book_id, quantity } of billExport.bill_export_detail) {
            const book = books.find((i) => i.id === book_id);
            if (book) {
              book.quantity -= quantity;
              book.sold += quantity;
              booksToBeUpdated.push(book);
            }
          }

          await BookRepository.save(booksToBeUpdated);
        }
      }
      billExport.status = request.status;
    }
    return BillExportRepository.save(billExport);
  }
}
