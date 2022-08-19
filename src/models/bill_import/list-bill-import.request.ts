import { Pagination } from "@models/Pagination";
import { Transform } from "class-transformer";
import { Allow, IsBoolean, IsOptional } from "class-validator";
export class ListBillImportRequest extends Pagination {
  @Allow()
  fillter: string;

  @IsOptional()
  @IsBoolean()
  @Transform((value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  isReport: boolean;
}
