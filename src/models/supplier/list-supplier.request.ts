import { Pagination } from "@models/Pagination";
import { Allow, IsEnum, IsOptional } from "class-validator";
import { OrderBy } from "./orderBy.enum";
export class ListSupplierRequest extends Pagination {
  @Allow()
  fillter: string;
}
