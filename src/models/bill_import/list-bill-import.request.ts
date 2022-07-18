import { Pagination } from "@models/Pagination";
import { Allow } from "class-validator";
export class ListBillImportRequest extends Pagination {
  @Allow()
  search: string;
}
