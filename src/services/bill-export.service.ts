import { Service } from "typedi";
import { BookEntity } from "@entity/book.entity";
import { AppDataSource } from "@config/db";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { BillImportDetailRepository } from "@repos/bill-import-detail.repository";
import { BillImportRepository } from "@repos/bill-import.repository";
import { ListBillImportRequest } from "@models/bill_import/list-bill-import.request";
import { MoreThanOrEqual } from "typeorm";
import { UpdateBillImportRequest } from "@models/bill_import/update-bill-import.request";
import { SupplierRepository } from "@repos/supplier.repository";
import { BookRepository } from "@repos/book.repository";
import { CreateBillExportRequest } from "@models/bill_export/create-bill-export.request";
import { UserEntity } from "@entity/user.entity";
import { BillExportRepository } from "@repos/bill-export.repository";
import { BillExportDetailRepository } from "@repos/bill-export-detail.repository";
import { UserInfo } from "@models/user/UserInfo";
import { Role } from "@enums/role.enum";
import { ListBillExportRequest } from "@models/bill_export/list-bill-export.request";
import { UpdateBillExportRequest } from "@models/bill_export/update-bill-export.request";
import { UserRepository } from "@repos/user.repository";
require("dotenv").config();
@Service()
export class BillExportService {
  constructor() {}
  async create(request: CreateBillExportRequest, userInfo: UserInfo) {
    if (userInfo.role === Role.USER) {
    }
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const user = await queryRunner.manager.findOneByOrFail(UserEntity, {
      id: request.user_id,
    });
    if (!user.address || !user.phone) {
      throw ApiError(StatusCodes.BAD_REQUEST, `address and phone must require`);
    }
    try {
      await queryRunner.startTransaction();
      const bill_export_instance = BillExportRepository.create();
      bill_export_instance.user = user;
      const bill_export = await queryRunner.manager.save(bill_export_instance);
      for (const bookRequest of request.books) {
        const bookInventory = await queryRunner.manager.findOneByOrFail(
          BookEntity,
          {
            id: bookRequest.id,
          }
        );
        if (bookRequest.quantity > bookInventory.quantity) {
          throw ApiError(
            StatusCodes.BAD_REQUEST,
            `Quanlity of book ${bookRequest.id} with quality ${bookRequest.quantity} greater than inventory ${bookInventory.id} with quality ${bookInventory.quantity}`
          );
        }
        const bill_export_detail = BillExportDetailRepository.create();
        bill_export_detail.book = bookInventory;
        bill_export_detail.quantity = bookRequest.quantity;
        bill_export_detail.bill_export = bill_export;
        await queryRunner.manager.save(bill_export_detail);
        bookInventory.quantity = bookInventory.quantity - bookRequest.quantity;
        bookInventory.sold = bookInventory.sold + bookRequest.quantity;
        await queryRunner.manager.save(bookInventory);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw ApiError(StatusCodes.BAD_REQUEST, "", error);
    } finally {
      await queryRunner.release();
    }
  }

  list(request: ListBillExportRequest) {
    return BillExportRepository.getList(request);
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
