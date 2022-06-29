import { Pagination } from "@models/Pagination";
import { Sort } from "@models/sort";
import { Allow, IsEnum, IsOptional } from "class-validator";
import { OrderBy } from "./orderBy.enum";
export class ListSupplierRequest extends Pagination {
  @Allow()
  search: string;

  @Allow()
  address: string;

  @Allow()
  phone: string;

  @IsOptional()
  @IsEnum(Sort)
  order: Sort;

  @IsOptional()
  @IsEnum(OrderBy)
  orderBy: OrderBy;
}
