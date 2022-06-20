import { LoginRequest } from "@models/auth/login.request";
import { AuthRepository } from "@repos/auth.repository";
import { Service } from "typedi";

@Service()
export class AuthService {
  constructor() {}
  async login(request: LoginRequest) {
    const user = await AuthRepository.login(request);
    if (!user) {
      throw new Error("username or password incorrect !");
    }
    return user;
  }
}
