import { IsNotEmpty, IsOptional, IsString } from "class-validator";
export class UpdateSupplierRequest {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  address: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  company: string;
}
