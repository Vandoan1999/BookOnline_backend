import { TableColumn } from "@models/reportModel";

export const REPORT_EXPORT_COLUMN: TableColumn[] = [
  {
    name: "STT",
    width: 10,
  },
  {
    name: "Trạng thái",
    width: 20,
  },
  {
    name: "Tên Sách",
    width: 70,
  },
  {
    name: "Giá Sách",
    width: 10,
  },
  {
    name: "Giảm giá",
    width: 10,
  },
  {
    name: "Số Lượng",
    width: 10,
  },
  {
    name: "Thành tiền",
    width: 10,
  },
];

export const REPORT_IMPORT_COLUMN: TableColumn[] = [
  {
    name: "STT",
    width: 10,
  },
  {
    name: "Tên Sách",
    width: 70,
  },
  {
    name: "Giá sách",
    width: 15,
  },
  {
    name: "Số Lượng",
    width: 15,
  },
  {
    name: "Thành tiền",
    width: 15,
  },
];
