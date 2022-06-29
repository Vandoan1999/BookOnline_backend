import { Allow } from "class-validator";
export class UserInfo {
  @Allow()
  id: string;

  @Allow()
  username: string;

  @Allow()
  role: string;

  @Allow()
  email: string;
}
