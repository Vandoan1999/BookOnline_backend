export enum BillExportStatus {
  Pending = 0, // đơn mới tạo
  Confirmed = 1, // đơn đã xác nhận
  InProgress = 3, // đơn đang giao hàng
  Delivered = 4, //đơn đã giao hàng
  Reject = 5, //đơn đã từ chối
  InReturning = 6, //đơn đang đang trả hàng về
  Returned = 7, ////đơn đang đã trả hàng về
}
