import { Gender } from "@enums/gender.enum";
import { Allow, IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserRequest {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  email: string;

  @IsOptional()
  fullName: string;

  @IsOptional()
  @IsEnum(Gender)
  sex: Gender;

  @IsOptional()
  address: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  bank: string;
}
