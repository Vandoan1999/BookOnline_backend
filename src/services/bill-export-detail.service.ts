import { Service } from "typedi";
import { BillExportDetailRepository } from "@repos/bill-export-detail.repository";

require("dotenv").config();
@Service()
export class BillExportDetailService {
  constructor() {}

  async delete(book_id: string, bill_export_id: string) {
    if (book_id && bill_export_id) {
      const billExportDetail = await BillExportDetailRepository.findOneByOrFail(
        { book_id, bill_export_id }
      );
      return BillExportDetailRepository.delete({ book_id, bill_export_id });
    }
  }
}
