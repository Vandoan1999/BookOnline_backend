import { Allow } from "class-validator";
export class LoginRequest {
  @Allow()
  username: string;

  @Allow()
  password: string;
}
