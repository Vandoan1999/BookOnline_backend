import { Pagination } from "@models/Pagination";
import { IsNotEmpty, IsOptional } from "class-validator";
export class GetListRatingRequest extends Pagination {
  @IsOptional()
  fillter: string;

  @IsNotEmpty()
  book_id: string;
}
