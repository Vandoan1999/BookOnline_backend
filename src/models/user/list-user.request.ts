import { Pagination } from "@models/Pagination";
import { Allow, IsEnum, IsOptional } from "class-validator";
export class ListUserRequest extends Pagination {
  @Allow()
  fillter: string;
}
