import { Service } from "typedi";
import { BillImportDetailRepository } from "@repos/bill-import-detail.repository";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { UpdateBillImportDetailRequest } from "@models/bill_import_detail/update-bill-import-detail.request";
import { BookRepository } from "@repos/book.repository";
import { CreateBillImportDetailRequest } from "@models/bill_import_detail/add-bill-import-detail.request";
import { BillImportRepository } from "@repos/bill-import.repository";
import { BillExportDetailRepository } from "@repos/bill-export-detail.repository";

require("dotenv").config();
@Service()
export class BillImportDetailService {
  constructor() {}

  async create(request: CreateBillImportDetailRequest) {
    const [billimport, book] = await Promise.all([
      BillImportRepository.findOneByOrFail({ id: request.bill_import_id }),
      BookRepository.findOneByOrFail({ id: request.book_id }),
    ]);

    const billImportDetailToBeSaved = BillImportDetailRepository.create();
    billImportDetailToBeSaved.book = book;
    billImportDetailToBeSaved.bill_import = billimport;
    billImportDetailToBeSaved.quantity = request.quantity;
    await BillImportDetailRepository.insert(billImportDetailToBeSaved);
    book.quantity += request.quantity;
    await BookRepository.save(book);
  }
  async delete(book_id: string, bill_export_id: string) {
    if (book_id && bill_export_id) {
      const billIimportDetail =
        await BillExportDetailRepository.findOneByOrFail({
          bill_export_id,
          book_id,
        });

      await BillExportDetailRepository.delete({
        bill_export_id: billIimportDetail.bill_export_id,
        book_id: billIimportDetail.book_id,
      });

      return;
    }

    throw ApiError(StatusCodes.BAD_REQUEST);
  }

  async update(request: UpdateBillImportDetailRequest) {
    const billIimportDetail = await BillImportDetailRepository.findOneByOrFail({
      bill_import_id: request.bill_import_id,
      book_id: request.book_id,
    });

    const bookInstance = await BookRepository.findOneOrFail({
      where: { id: request.book_id },
    });

    if (request.quantity > bookInstance.quantity) {
      throw ApiError(
        StatusCodes.BAD_REQUEST,
        `quantity not valid Book: ${bookInstance.quantity} < ${request.quantity}`
      );
    }
    bookInstance.quantity =
      bookInstance.quantity - billIimportDetail.quantity + request.quantity;
    billIimportDetail.quantity = bookInstance.quantity;
    await Promise.all([
      BookRepository.save(bookInstance),
      BillImportDetailRepository.save(billIimportDetail),
    ]);
  }
}
