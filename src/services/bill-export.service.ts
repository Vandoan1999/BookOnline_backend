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
import { BillExport } from "@entity/bill-export.entity";
import { uploadFile } from "@common/baseAWS";
import { config } from "@config/app";
const PDFDocument = require("pdfkit-table");
const fs = require("fs");
const path = require("path");
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
    if (request.isReport) {
      this.getReport(billExport);
      return {
        billExport: null,
        total: null,
        link: "https://shopbook.s3.ap-southeast-1.amazonaws.com/images/TestDocument.pdf",
      };
    }

    for (let bill of billExport) {
      const user = await this.imageService.getImageByObject([bill.user]);
      bill.user = user[0];
    }

    return {
      billExport,
      total,
      link: "",
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

  private getReport(billExport: BillExport[]) {
    const pathFile = path.join(process.cwd(), "file-report");
    const pathFont = path.join(process.cwd(), "fonts");
    const data: any[] = [];
    for (const bx of billExport) {
      for (const bxd of bx.bill_export_detail) {
        data.push({
          id: bx.id.substring(1, 5),
          username: bx.user.username,
          bookname: bxd.book.name,
          quantity: bxd.quantity,
          price: bxd.quantity * bxd.book.price_export,
        });
      }
    }
    let doc = new PDFDocument({ margin: 30, size: "A4" });
    if (data.length > 0) {
      data.push({
        id: "Tổng",
        quantity: data.reduce((pre, cur) => pre + cur.quantity, 0),
        price: data.reduce((pre, cur) => pre + cur.price, 0),
      });
    }
    doc.pipe(fs.createWriteStream(`${pathFile}/TestDocument.pdf`));
    (async function () {
      // table
      const table = {
        title: {
          label: "BÁO CÁO HÓA ĐƠN XUẤT",
          fontSize: 30,
          fontFamily: `${pathFont}/AlegreyaSansSC-Black.otf`,
          valign: "center",
        },
        headers: [
          {
            label: "id HD",
            property: "id",
            width: 60,
            fontFamily: `${pathFont}/AlegreyaSans-Light.otf`,
            renderer: null,
          },
          {
            label: "Tên KH",
            property: "username",
            width: 100,
            fontFamily: `${pathFont}/AlegreyaSans-Light.otf`,
            renderer: null,
          },
          {
            label: "Tên Sách",
            property: "bookname",
            width: 150,
            fontFamily: `${pathFont}/AlegreyaSans-Light.otf`,
            renderer: null,
          },
          {
            label: "Số Lượng",
            property: "quantity",
            width: 150,
            fontFamily: `${pathFont}/AlegreyaSans-Light.otf`,
            renderer: null,
          },
          {
            label: "Giá",
            property: "price",
            width: 100,
            fontFamily: `${pathFont}/AlegreyaSans-Light.otf`,
            renderer: null,
          },
        ],
        // complex data
        datas: data,
      };
      // the magic
      doc.table(table, {
        prepareHeader: () =>
          doc.font(`${pathFont}/AlegreyaSans-Light.otf`).fontSize(12),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font(`${pathFont}/AlegreyaSans-Light.otf`).fontSize(10);
        },
      });
      // done!
      doc.end();
    })();
    fs.readFile(`${pathFile}/TestDocument.pdf`, async (err, data) => {
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
