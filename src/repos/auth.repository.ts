import { UserEntity } from "@entity/user.entity";
import { AppDataSource } from "@config/db";

export const AuthRepository = AppDataSource.getRepository(UserEntity).extend({
  getUserByName(username: string) {
    return this.createQueryBuilder("user").where("user.username = :username", { username: username }).addSelect("user.password").getOne();
  },
});
