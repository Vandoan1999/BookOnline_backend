import { IsNotEmpty, IsString } from "class-validator";
export class CreateSupplierRequest {
  @IsNotEmpty()
  address: string;

  @IsString()
  phone: string;

  @IsNotEmpty()
  company: string;
}
