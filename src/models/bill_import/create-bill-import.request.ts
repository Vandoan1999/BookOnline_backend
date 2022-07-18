import { IsArray, IsNotEmpty } from "class-validator";
export class CreateBillImportRequest {
  @IsNotEmpty()
  supplier_id: string;

  @IsNotEmpty()
  @IsArray()
  books: book_import[];
}

interface book_import {
  id: string;
  quantity: number;
}
