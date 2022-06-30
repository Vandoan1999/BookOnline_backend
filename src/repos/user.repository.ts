import { config } from "@config/app";
import { AppDataSource } from "@config/db";
import { UserEntity } from "@entity/user.entity";
import { OrderByEnum } from "@models/user/orderBy.enum";
import { ListUserRequest } from "@models/user/list-user.request";

export const UserRepository = AppDataSource.getRepository(UserEntity).extend({
  getList(request: ListUserRequest) {
    const take = request.limit || config.page.default_limit;
    const page = request.page || 1;
    const skip = (page - 1) * take;

    const query = this.createQueryBuilder("user");

    if (request.search) {
      query.where("user.name LIKE :name", { name: `%${request.search}%` });
    }

    if (request.orderBy === OrderByEnum.email) {
      query.orderBy("user.email", request.order);
    } else if (request.orderBy === OrderByEnum.username) {
      query.orderBy("user.username", request.order);
    } else {
      query.orderBy("user.email", "ASC");
    }

    return query.take(take).skip(skip).getManyAndCount();
  },
});
