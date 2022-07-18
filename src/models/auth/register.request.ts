import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
export class RegisterRequest {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  fullName: string;

  @IsOptional()
  address: string;

  @IsOptional()
  phone: string;
}
