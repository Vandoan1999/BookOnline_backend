import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
export class UpdateBillExportRequest {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  user_id: string;
  @IsOptional()
  @IsArray()
  books: book_import[];
}

interface book_import {
  id: string;
  quality: number;
}
