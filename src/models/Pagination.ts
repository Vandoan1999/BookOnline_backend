import { IsOptional } from "class-validator";
export class Pagination {
  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;
}
