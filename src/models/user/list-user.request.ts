import { Pagination } from "@models/Pagination";
import { Sort } from "@models/sort";
import { Allow, IsEnum, IsOptional } from "class-validator";
import { OrderByEnum } from "./orderBy.enum";
export class ListUserRequest extends Pagination {
  @Allow()
  search: string;

  @IsOptional()
  @IsEnum(Sort)
  order: Sort;

  @IsOptional()
  @IsEnum(OrderByEnum)
  orderBy: OrderByEnum;
}
