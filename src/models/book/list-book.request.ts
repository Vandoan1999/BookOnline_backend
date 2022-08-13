import { Pagination } from "@models/Pagination";
import { Allow } from "class-validator";
export class ListBookRequest extends Pagination {
  @Allow()
  fillter: string;
}
