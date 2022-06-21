import { UserRole } from "@enums/role.enum";
import { LoginRequest } from "@models/auth/login.request";
import { RegisterRequest } from "@models/auth/register.request";
import { AuthRepository } from "@repos/auth.repository";
import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import { hashSync, compareSync } from "bcryptjs";
import { ApiError } from "src/ultis/apiError";
import jwt from "jsonwebtoken";
require("dotenv").config();
@Service()
export class AuthService {
  constructor() { }
  async login(request: LoginRequest) {
    const user = await AuthRepository.getUserByName(request.username);
    if (!user || !compareSync(request.password, user.password)) {
      throw ApiError(StatusCodes.NOT_FOUND, "Username or password not correct !");
    }

    const token = jwt.sign(
      {
        namename: user.username,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET!
    );

    return token;
  }

  register(request: RegisterRequest) {
    const user = Object.assign(AuthRepository.create(), request);
    if (user.role === UserRole.ADMIN) {
      throw ApiError(StatusCodes.FORBIDDEN, "You cannot create user admin !");
    }
    user.password = hashSync(user.password, 10);
    return AuthRepository.save(user);
  }
}
