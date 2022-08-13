"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillExportStatus = void 0;
var BillExportStatus;
(function (BillExportStatus) {
    BillExportStatus[BillExportStatus["Pending"] = 0] = "Pending";
    BillExportStatus[BillExportStatus["Confirmed"] = 1] = "Confirmed";
    BillExportStatus[BillExportStatus["InProgress"] = 3] = "InProgress";
    BillExportStatus[BillExportStatus["Delivered"] = 4] = "Delivered";
    BillExportStatus[BillExportStatus["Reject"] = 5] = "Reject";
    BillExportStatus[BillExportStatus["InReturning"] = 6] = "InReturning";
    BillExportStatus[BillExportStatus["Returned"] = 7] = "Returned";
})(BillExportStatus = exports.BillExportStatus || (exports.BillExportStatus = {}));
