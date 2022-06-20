import { UserEntity } from "@entity/user.entity";
import { AppDataSource } from "@config/db";
import { LoginRequest } from "@models/auth/login.request";

export const AuthRepository = AppDataSource.getRepository(UserEntity).extend({
  login(request: LoginRequest) {
    return this.createQueryBuilder("user")
      .where("user.name = :name", { name: request.username })
      .andWhere("user.password = :password", { password: request.password })
      .getOne();
  },
});
