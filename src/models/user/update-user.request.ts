import { Gender } from "@enums/gender.enum";
import { Allow, IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserRequest {
  @IsNotEmpty()
  id: string;

  @Allow()
  email: string;

  @IsOptional()
  @IsEnum(Gender)
  sex: Gender;

  @Allow()
  image: string;

  @IsOptional()
  address: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  bank: string;
}
