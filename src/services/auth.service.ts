import { Role } from "@enums/role.enum";
import { LoginRequest } from "@models/auth/login.request";
import { RegisterRequest } from "@models/auth/register.request";
import { AuthRepository } from "@repos/auth.repository";
import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import { hashSync, compareSync } from "bcryptjs";
import { ApiError } from "../ultis/apiError";
import jwt from "jsonwebtoken";
import { UserInfo } from "@models/user/UserInfo";
import { ChangePasswordRequest } from "@models/auth/change-password.request";
import { ImageService } from "./image.service";
require("dotenv").config();
@Service()
export class AuthService {
  constructor(private imageService: ImageService) {}
  async login(request: LoginRequest) {
    const user = await AuthRepository.getUserByName(request.username);
    if (!user || !compareSync(request.password, user.password)) {
      throw ApiError(
        StatusCodes.NOT_FOUND,
        "Username or password not correct !"
      );
    }
    const token = jwt.sign(
      {
        id: user.id,
        namename: user.username,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET!
    );

    return token;
  }

  register(request: RegisterRequest) {
    const user = AuthRepository.create(request);
    user.password = hashSync(user.password, 10);
    return AuthRepository.save(user);
  }

  async getProfile(userInfo: UserInfo) {
    const user = await AuthRepository.findOne({
      where: {
        id: userInfo.id,
      },
    });
    const userReturn = await this.imageService.getImageByObject([user]);
    return userReturn[0];
  }

  async forgotPassword(email: string) {
    const user = await AuthRepository.findOneOrFail({
      where: {
        email,
      },
    });
    user.password = hashSync("12345678", 10);
    user.is_pass_change = true;
    return AuthRepository.save(user);
  }

  async changePassword(request: ChangePasswordRequest) {
    const user = await AuthRepository.getUserByName(request.username);
    if (!user || !compareSync(request.oldPassword, user.password)) {
      throw ApiError(
        StatusCodes.NOT_FOUND,
        "Username or password not correct !"
      );
    }
    user.password = hashSync(request.newPassword, 10);
    user.is_pass_change = false;
    return AuthRepository.save(user);
  }
}
