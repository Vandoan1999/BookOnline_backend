import { Pagination } from "@models/Pagination";
import { SortEnum } from "@models/sort";
import { Allow, IsEnum, IsOptional } from "class-validator";
import { OrderByEnum } from "./orderBy.enum";
export class ListUserRequest extends Pagination {
    @Allow()
    search: string;

    @IsOptional()
    @IsEnum(SortEnum)
    order: SortEnum;

    @IsOptional()
    @IsEnum(OrderByEnum)
    orderBy: OrderByEnum;
}
