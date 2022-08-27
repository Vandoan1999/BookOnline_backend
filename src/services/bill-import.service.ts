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
import { ImageService } from "./image.service";
import { BillImportExcelModel } from "@models/bill_import/export-file.model";
import { ReportModel } from "@models/reportModel";
import {
  CHILD_COMPANY,
  CHILD_COMPANY_ADDRESS,
  CREATER,
  PARENT_COMPANY,
  REPORT_TIME,
  STOCKER_SIGNATURE,
} from "../ultis/constant";
import { REPORT_IMPORT_COLUMN } from "../base/export-column";
import { generateTable } from "../base/report-excel.layout";
import { GetObjectURl, uploadFile } from "@common/baseAWS";
import { config } from "@config/app";
require("dotenv").config();
@Service()
export class BillImportService {
  constructor(private imageService: ImageService) {}
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
        bookInstance.quantity += book.quantity;
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

  async list(request: ListBillImportRequest) {
    const [billImport, total] = await BillImportRepository.getList(request);

    if (request.export) {
      let data: any = billImport.reduce((prev, cur) => {
        const userInfo = [
          cur.id.substring(0, 5),
          cur.supplier.company,
          cur.supplier.address,
          cur.supplier.phone,
        ].join("-");
        if (!prev[userInfo]) {
          prev[userInfo] = [];
        }
        let totalPrice = 0;
        cur.bill_import_details.forEach((item, index) => {
          totalPrice += item.book.price_import * item.quantity;
          const data: BillImportExcelModel = {
            index: index + 1 + "",
            bookname: item.book.name,
            price: item.book.price_import.toString(),
            quantity: item.quantity.toString(),
            totalPrice: item.book.price_import * item.quantity,
          };
          prev[userInfo].push(data);
          if (index == cur.bill_import_details.length - 1) {
            const total: BillImportExcelModel = {
              index: "",
              bookname: "",
              price: "",
              quantity: "Tổng tiền",
              totalPrice: totalPrice,
            };
            prev[userInfo].push(total);
          }
        });
        return prev;
      }, {});

      data = Object.keys(data).map((key) => {
        return {
          userInfo: key,
          data: data[key],
        };
      });

      let reportTime = "Từ ngày: ...  đến ngày: ...";
      let pastData = new Date();
      pastData.setMonth(pastData.getMonth() - 1);
      pastData = pastData.toLocaleDateString() as any;
      reportTime = reportTime.replace("...", pastData as any);
      reportTime = reportTime.replace("...", new Date().toLocaleDateString());
      const model: ReportModel<BillImportExcelModel> = {
        parentCompany: PARENT_COMPANY,
        childCompany: CHILD_COMPANY,
        AddressChildCompany: CHILD_COMPANY_ADDRESS,
        reportTitle: "BÁO CÁO HÓA ĐƠN NHẬP THEO THÁNG",
        reportTime: reportTime,
        reportDateSignature: REPORT_TIME,
        stockerSignature: STOCKER_SIGNATURE,
        creater: CREATER,
        tableColumn: REPORT_IMPORT_COLUMN,
        tableData: data as any,
        footer: true,
        header: true,
        columnLevel: 1,
      };
      const buffer = await generateTable(model, "billImport");
      await uploadFile(
        buffer,
        config.s3Bucket,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        config.s3BucketForder + "billImport.xlsx"
      );
      const link = GetObjectURl("billImport.xlsx");
      return { billImport: null, total: 0, link: link };
    }

    for (let bill of billImport) {
      for (const bid of bill.bill_import_details) {
        if (bid.book.avartar) {
          bid.book.avartar = JSON.parse(bid.book.avartar);
        }

        if (bid.book.images) {
          bid.book.images = JSON.parse(bid.book.images);
        }
      }
    }
    return {
      billImport,
      total,
    };
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
