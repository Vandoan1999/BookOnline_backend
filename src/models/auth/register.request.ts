import { Gender } from "@enums/gender.enum";
import { Role } from "@enums/role.enum";
import { Allow, IsEmail, IsEnum, IsNotEmpty } from "class-validator";
export class RegisterRequest {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: Role;

  @IsEnum(Gender)
  sex: Gender;

  @Allow()
  image: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  bank: string;
}
