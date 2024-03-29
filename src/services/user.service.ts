import { Role } from "@enums/role.enum";
import { ListUserRequest } from "@models/user/list-user.request";
import { UpdateUserRequest } from "@models/user/update-user.request";
import { UserInfo } from "@models/user/UserInfo";
import { UserRepository } from "@repos/user.repository";
import { Service } from "typedi";
import { ImageRepository } from "@repos/image.repository";
import { BillExportRepository } from "@repos/bill-export.repository";
@Service()
export class UserService {
  async getList(request: ListUserRequest) {
    const [users, total] = await UserRepository.getList(request);
    let bill = await BillExportRepository.getBill(users.map((user) => user.id));

    users.forEach((user) => {
      if (user.avartar) {
        user.avartar = JSON.parse(user.avartar);
      }
      const billOfuser = bill.find((item) => item.user_id == user.id);
      if (billOfuser) {
        user["totalBill"] = Number(billOfuser.count);
        user["totalPrice"] = billOfuser.sum;
      }
    });
    return { users, total };
  }

  async update(request: UpdateUserRequest, userInfo: UserInfo) {
    if (userInfo && userInfo.role === Role.USER) {
      request.id = userInfo.id;
    }
    const user = await UserRepository.findOneByOrFail({ id: request.id });
    if (request.image) {
      const image = await ImageRepository.findOneByOrFail({
        id: request.image.id,
      });
      user.avartar = JSON.stringify(image);
    }

    for (const key in request) {
      if (user.hasOwnProperty(key)) {
        if (key === "images") {
          continue;
        }

        if (key === "avartar") {
          continue;
        }
        user[key] = request[key];
      }
    }

    const result = await UserRepository.save(user);
    if (result.avartar) {
      result.avartar = JSON.parse(result.avartar);
    }

    return result;
  }

  async detail(id: string, user: UserInfo | null = null) {
    if (user && user.role === Role.USER) {
      id = user && user?.id ? user?.id : id;
    }
    const userResult = await UserRepository.findOneByOrFail({ id });
    if (userResult.avartar) {
      userResult.avartar = JSON.parse(userResult.avartar);
    }
    return userResult;
  }
}
