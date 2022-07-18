import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
export class UpdateBillImportRequest {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  supplier_id: string;

  @IsOptional()
  @IsArray()
  books: book_import[];
}

interface book_import {
  id: string;
  quality: number;
}
