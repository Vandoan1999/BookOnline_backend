export enum BillExportStatus {
  Pending = 0, // đơn mới tạo
  Confirmed = 1, // đơn đã xác nhận
  delivered = 2, // đơn đã giao hàng
  Reject = 5, //đơn đã từ chối
}
