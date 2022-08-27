export const LANG = {
  EN: "en",
  VI: "vi",
};

export const DEFAULT_LANG = LANG.VI;

export const FONT_NAME = "Times New Roman";
export const COLOR = "000000";
export const EXCEL_COLUMN = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
];
export const REPORT_DATE_SIGNATURE = "Bình Thuận,  ngày ... tháng ... năm ....";
export const STOCKER_SIGNATURE = "Thủ kho";
export const CREATER = "Người lập biểu";
export const PARENT_COMPANY = "CỬA HÀNG SÁCH TÂM ĐOÀN";
export const CHILD_COMPANY = "LỚP LTMT1 K11";
export const CHILD_COMPANY_ADDRESS =
  "92A LÊ THANH NGHỊ - HAI BÀ TRƯNG - HÀ HỘI";
export const REPORT_TIME = "Từ ngày: ...  đến ngày: ...";

export const FONT = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: true,
  size: 10,
};

export const FONT_TITLE = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: true,
  size: 14,
};

export enum TypeReportInventory {
  ITEM_INVENTORY = 0,
  ITEM_INVENTORY_BELOW_MINIMUM = 1,
}
