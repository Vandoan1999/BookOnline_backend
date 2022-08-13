import { config } from "@config/app";
import { AppDataSource } from "@config/db";
import { UserEntity } from "@entity/user.entity";
import { ListUserRequest } from "@models/user/list-user.request";
import { Role } from "@enums/role.enum";
import { Gender } from "@enums/gender.enum";
import { Order } from "@enums/order";

export const UserRepository = AppDataSource.getRepository(UserEntity).extend({
  getList(request: ListUserRequest) {
    const take = request.limit || config.page.default_limit;
    const page = request.page || 1;
    const skip = (page - 1) * take;
    const query = this.createQueryBuilder("user");
    if (request.fillter) {
      const fillter = JSON.parse(request.fillter);
      fillter.forEach((item) => {
        switch (item.column) {
          case "username":
            query.andWhere("LOWER(user.username) LIKE LOWER(:username)", {
              username: `%${item.text}%`,
            });
            break;

          case "email":
            query.andWhere("user.email LIKE :email", {
              email: `%${item.text}%`,
            });
            break;

          case "role":
            if (Role.ADMIN === item.text || Role.USER == item.text)
              query.andWhere("user.role = :role", {
                role: `${item.text}`,
              });
            break;
          case "sex":
            if (
              Gender.FEMALE === Number(item.text) ||
              Gender.MALE === Number(item.text)
            ) {
              query.andWhere("user.sex = :sex", {
                role: `${Number(item.text)}`,
              });
            }
            break;

          case "address":
            query.andWhere("user.address LIKE :address", {
              address: `%${item.text}%`,
            });
            break;

          case "fullName":
            query.andWhere("user.fullName LIKE :fullName", {
              fullName: `%${item.text}%`,
            });
            break;
          case "phone":
            query.andWhere("user.phone LIKE :phone", {
              phone: `%${item.text}%`,
            });
            break;

          case "bank":
            query.andWhere("user.bank LIKE :bank", {
              bank: `%${item.text}%`,
            });

          case "is_active":
            if (item.text === "true" || item.text === "false") {
              item.text = item.text === "true" ? true : false;
              query.andWhere("user.is_active = :is_active", {
                is_active: `${item.text}`,
              });
            }
            break;

          case "created_at":
            if (item.text === Order.ASC || item.text === Order.DESC)
              query.orderBy("book.created_at", item.text);
            break;
        }
      });
    }
    return query.take(take).skip(skip).getManyAndCount();
  },

  totalCustomer() {
    return this.createQueryBuilder("user")
      .select("COUNT(user.id)", "total_user")
      .where("user.role = :role", { role: Role.USER })
      .getRawOne();
  },
});
