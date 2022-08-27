"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeReportInventory = exports.FONT_TITLE = exports.FONT = exports.REPORT_TIME = exports.CHILD_COMPANY_ADDRESS = exports.CHILD_COMPANY = exports.PARENT_COMPANY = exports.CREATER = exports.STOCKER_SIGNATURE = exports.REPORT_DATE_SIGNATURE = exports.EXCEL_COLUMN = exports.COLOR = exports.FONT_NAME = exports.DEFAULT_LANG = exports.LANG = void 0;
exports.LANG = {
    EN: "en",
    VI: "vi",
};
exports.DEFAULT_LANG = exports.LANG.VI;
exports.FONT_NAME = "Times New Roman";
exports.COLOR = "000000";
exports.EXCEL_COLUMN = [
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
exports.REPORT_DATE_SIGNATURE = "Bình Thuận,  ngày ... tháng ... năm ....";
exports.STOCKER_SIGNATURE = "Thủ kho";
exports.CREATER = "Người lập biểu";
exports.PARENT_COMPANY = "TÊN CỬA HÀNG: CỬA HÀNG SÁCH TÂM ĐOÀN";
exports.CHILD_COMPANY = "LỚP: LTMT1 K11";
exports.CHILD_COMPANY_ADDRESS = "ĐỊA CHỈ: 92A LÊ THANH NGHỊ - HAI BÀ TRƯNG - HÀ HỘI";
exports.REPORT_TIME = "Từ ngày: ...  đến ngày: ...";
exports.FONT = {
    name: exports.FONT_NAME,
    color: { argb: exports.COLOR },
    bold: true,
    size: 10,
};
exports.FONT_TITLE = {
    name: exports.FONT_NAME,
    color: { argb: exports.COLOR },
    bold: true,
    size: 14,
};
var TypeReportInventory;
(function (TypeReportInventory) {
    TypeReportInventory[TypeReportInventory["ITEM_INVENTORY"] = 0] = "ITEM_INVENTORY";
    TypeReportInventory[TypeReportInventory["ITEM_INVENTORY_BELOW_MINIMUM"] = 1] = "ITEM_INVENTORY_BELOW_MINIMUM";
})(TypeReportInventory = exports.TypeReportInventory || (exports.TypeReportInventory = {}));
