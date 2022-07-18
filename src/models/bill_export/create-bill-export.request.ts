import { IsArray, IsNotEmpty } from "class-validator";
export class CreateBillExportRequest {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  @IsArray()
  books: book_export[];
}

interface book_export {
  id: string;
  quantity: number;
}
