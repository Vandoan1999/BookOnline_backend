import { Pagination } from "@models/Pagination";
import { SortEnum } from "@models/sort";
import { Allow, IsEnum, IsOptional } from "class-validator";
import { OrderByEnum } from "./orderBy.enum";
export class ListBookRequest extends Pagination {
  @Allow()
  name: string;

  @Allow()
  author: string;

  @IsOptional()
  @IsEnum(SortEnum)
  order: SortEnum;

  @IsOptional()
  @IsEnum(OrderByEnum)
  orderBy: OrderByEnum;
}
