import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
export class UpdateBillImportRequest {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  supplier_id: string;
}
