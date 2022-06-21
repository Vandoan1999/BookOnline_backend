import { Allow, IsNotEmpty } from "class-validator";
export class LoginRequest {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
