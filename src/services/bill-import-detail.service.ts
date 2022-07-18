import { Service } from "typedi";
import { BillImportDetailRepository } from "@repos/bill-import-detail.repository";
import { ApiError } from "src/ultis/apiError";
import { StatusCodes } from "http-status-codes";

require("dotenv").config();
@Service()
export class BillImportDetailService {
  constructor() {}

  async delete(book_id: string, bill_import_id: string) {
    if (book_id && bill_import_id) {
      const res = await BillImportDetailRepository.delete({
        bill_import_id: bill_import_id,
        book_id: book_id,
      });

      if (res.affected !== 1) {
        throw ApiError(
          StatusCodes.NOT_FOUND,
          `${book_id} - ${bill_import_id} not found!`
        );
      }

      return;
    }

    throw ApiError(StatusCodes.BAD_REQUEST);
  }
}
