import { IsNotEmpty } from "class-validator";
export class CreateBillImportDetailRequest {
  @IsNotEmpty()
  book_id: string;

  @IsNotEmpty()
  bill_import_id: string;

  @IsNotEmpty()
  quantity: number;
}
