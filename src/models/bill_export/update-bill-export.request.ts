import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
export class UpdateBillExportRequest {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  status: number;
}
