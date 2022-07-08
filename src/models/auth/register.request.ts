import { IsEmail, IsNotEmpty } from "class-validator";
export class RegisterRequest {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
