import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
export class ChangePasswordRequest {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;
}
