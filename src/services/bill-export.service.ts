import { Service } from "typedi";
import { BookEntity } from "@entity/book.entity";
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
import { BillExportExcelModel } from "@models/bill_export/export-file.model";
import { ReportModel, TableData } from "@models/reportModel";
import {
  CHILD_COMPANY,
  CHILD_COMPANY_ADDRESS,
  CREATER,
  PARENT_COMPANY,
  REPORT_TIME,
  STOCKER_SIGNATURE,
} from "../ultis/constant";
import { REPORT_EXPORT_COLUMN } from "../base/export-column";
import { generateTable } from "../base/report-excel.layout";
import { GetObjectURl, uploadFile } from "@common/baseAWS";
import { config } from "@config/app";
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
      const bill_export_detail = BillExportDetailRepository.create();
      bill_export_detail.book_id = book.id;
      bill_export_detail.quantity = bookRequest.quantity;
      bill_export_detail.bill_export_id = bill_export.id;
      book.quantity -= bookRequest.quantity;
      book.sold += 1;
      await BookRepository.save(book);
      await BillExportDetailRepository.insert(bill_export_detail);
    }
  }

  async list(request: ListBillExportRequest, user: UserInfo) {
    const [billExport, total] = await BillExportRepository.getList(
      request,
      user
    );
    if (request.export) {
      let data = billExport.reduce((prev, cur) => {
        const userInfo = [
          cur.id.substring(0, 5),
          cur.user.username,
          cur.user.address,
          cur.user.phone,
        ].join("-");
        if (!prev[userInfo]) {
          prev[userInfo] = [];
        }
        let status = "";
        switch (cur.status) {
          case BillExportStatus.Pending:
            status = "Đang đặt hàng";
            break;

          case BillExportStatus.Confirmed:
            status = "Đã nhận";
            break;
          case BillExportStatus.Reject:
            status = "Sản phảm bị trả lại";
            break;
        }
        let totalPrice = 0;
        cur.bill_export_detail.forEach((item, index) => {
          totalPrice += item.book.price_export * item.quantity;
          const data: BillExportExcelModel = {
            index: index + 1 + "",
            status: status,
            bookname: item.book.name,
            price: item.book.price_export + "",
            discounted: item.book.discounted + "%",
            quantity: item.quantity + "",
            totalPrice: item.book.price_export * item.quantity + "",
          };
          prev[userInfo].push(data);
          if (index == cur.bill_export_detail.length - 1) {
            const total: BillExportExcelModel = {
              index: "",
              status: "",
              bookname: "",
              price: "",
              discounted: "",
              quantity: "Tổng tiền",
              totalPrice: totalPrice + "",
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
      const model: ReportModel<BillExportExcelModel> = {
        parentCompany: PARENT_COMPANY,
        childCompany: CHILD_COMPANY,
        AddressChildCompany: CHILD_COMPANY_ADDRESS,
        reportTitle: "BÁO CÁO HÓA ĐƠN XUẤT THEO THÁNG",
        reportTime: reportTime,
        reportDateSignature: REPORT_TIME,
        stockerSignature: STOCKER_SIGNATURE,
        creater: CREATER,
        tableColumn: REPORT_EXPORT_COLUMN,
        tableData: data as any,
        footer: true,
        header: true,
        columnLevel: 1,
      };
      const buffer = await generateTable(model, "billExport");
      await uploadFile(
        buffer,
        config.s3Bucket,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        config.s3BucketForder + "billExport.xlsx"
      );
      const link = GetObjectURl("billExport.xlsx");
      return { billExport: null, total: 0, link: link };
    }
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
