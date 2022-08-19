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
import { BillImport } from "@entity/bill-import.entity";
import { uploadFile } from "@common/baseAWS";
import { config } from "@config/app";
const PDFDocument = require("pdfkit-table");
const fs = require("fs");
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
    if (request.isReport) {
      this.getReport(billImport);
      return {
        billImport: null,
        total: null,
        link: "https://shopbook.s3.ap-southeast-1.amazonaws.com/images/TestDocument.pdf",
      };
    }
    return {
      billImport,
      total,
      link: "",
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

  private getReport(billImport: BillImport[]) {
    const data: any[] = [];
    for (const bi of billImport) {
      for (const bid of bi.bill_import_details) {
        data.push({
          id: bi.id.substring(1, 5),
          username: bi.supplier.company,
          bookname: bid.book.name,
          quantity: bid.quantity,
          price: bid.quantity * bid.book.price_import,
        });
      }
    }
    if (data.length > 0) {
      data.push({
        id: "Tổng",
        quantity: data.reduce((pre, cur) => pre + cur.quantity, 0),
        price: data.reduce((pre, cur) => pre + cur.price, 0),
      });
    }
    let doc = new PDFDocument({ margin: 30, size: "A4" });
    doc.pipe(fs.createWriteStream("file-report/TestDocument.pdf"));
    (async function () {
      // table
      const table = {
        title: {
          label: "BÁO CÁO HÓA ĐƠN NHẬP",
          fontSize: 30,
          fontFamily: "fonts/AlegreyaSansSC-Black.otf",
          valign: "center",
        },
        headers: [
          {
            label: "id HD",
            property: "id",
            width: 60,
            fontFamily: "fonts/AlegreyaSans-Light.otf",
            renderer: null,
          },
          {
            label: "Tên NCC",
            property: "username",
            width: 100,
            fontFamily: "fonts/AlegreyaSans-Light.otf",
            renderer: null,
          },
          {
            label: "Tên Sách",
            property: "bookname",
            width: 150,
            fontFamily: "fonts/AlegreyaSans-Light.otf",
            renderer: null,
          },
          {
            label: "Số Lượng",
            property: "quantity",
            width: 150,
            fontFamily: "fonts/AlegreyaSans-Light.otf",
            renderer: null,
          },
          {
            label: "Giá",
            property: "price",
            width: 100,
            fontFamily: "fonts/AlegreyaSans-Light.otf",
            renderer: null,
          },
        ],
        // complex data
        datas: data,
      };
      // the magic
      doc.table(table, {
        prepareHeader: () =>
          doc.font("fonts/AlegreyaSans-Light.otf").fontSize(12),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font("fonts/AlegreyaSans-Light.otf").fontSize(10);
        },
      });
      // done!
      doc.end();
    })();
    fs.readFile("file-report/TestDocument.pdf", async (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      await uploadFile(
        data,
        config.s3Bucket,
        "application/pdf",
        "images/TestDocument.pdf"
      );
    });
  }
}
