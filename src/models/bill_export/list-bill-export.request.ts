import { Pagination } from "@models/Pagination";
import { Allow } from "class-validator";
export class ListBillExportRequest extends Pagination {
  @Allow()
  fillter: string;
}
