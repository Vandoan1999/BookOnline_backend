import { Service } from "typedi";
import { CreateBillImportRequest } from "@models/bill_import/create-bill-import.request";
import { BookEntity } from "@entity/book.entity";
import { AppDataSource } from "@config/db";
import { SupplierEnity } from "@entity/supliers.entity";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { BillImportDetailRepository } from "@repos/bill-import-detail.repository";
import { BillImportRepository } from "@repos/bill-import.repository";
import { ListBillImportRequest } from "@models/bill_import/list-bill-import.request";
import { MoreThanOrEqual } from "typeorm";
import { UpdateBillImportRequest } from "@models/bill_import/update-bill-import.request";
import { SupplierRepository } from "@repos/supplier.repository";
import { BookRepository } from "@repos/book.repository";

require("dotenv").config();
@Service()
export class BillImportService {
  constructor() {}
  async create(request: CreateBillImportRequest) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const supplier = await queryRunner.manager.findOneByOrFail(SupplierEnity, {
      id: request.supplier_id,
    });
    try {
      await queryRunner.startTransaction();
      const bill_import_instance = BillImportRepository.create();
      bill_import_instance.supplier = supplier;
      const bill_import = await queryRunner.manager.save(bill_import_instance);
      for (const book of request.books) {
        const bookInstance = await queryRunner.manager.findOneByOrFail(
          BookEntity,
          {
            id: book.id,
          }
        );
        const bill_import_detail = BillImportDetailRepository.create();
        bill_import_detail.book = bookInstance;
        bill_import_detail.quantity = book.quantity;
        bill_import_detail.bill_import = bill_import;
        await queryRunner.manager.save(bill_import_detail);
        bookInstance.quantity = bookInstance.quantity + book.quantity;
        await queryRunner.manager.save(bookInstance);
      }
      await queryRunner.commitTransaction();
      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw ApiError(StatusCodes.BAD_REQUEST, "", error);
    } finally {
      await queryRunner.release();
    }
  }

  list(request: ListBillImportRequest) {
    return BillImportRepository.getList(request);
  }

  async delete(id: string) {
    if (id) {
      const bill = await BillImportRepository.findOneByOrFail({ id });
      return BillImportRepository.delete({ id: bill.id });
    }
  }

  async init() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const res = await Promise.all([
      BillImportDetailRepository.count(),
      BillImportDetailRepository.countBy({ created_at: MoreThanOrEqual(date) }),
    ]);
    return {
      totalBill: res[0],
      totalBillInCurrentDate: res[1],
    };
  }

  async update(request: UpdateBillImportRequest) {
    const billImport = await BillImportRepository.findOneOrFail({
      where: { id: request.id },
    });
    if (request.supplier_id) {
      const supplier = await SupplierRepository.findOneOrFail({
        where: { id: request.supplier_id },
      });
      billImport.supplier = supplier;
    }
  }
}
