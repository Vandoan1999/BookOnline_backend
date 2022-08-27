import { Role } from "@enums/role.enum";
import { ListUserRequest } from "@models/user/list-user.request";
import { UpdateUserRequest } from "@models/user/update-user.request";
import { UserInfo } from "@models/user/UserInfo";
import { UserRepository } from "@repos/user.repository";
import { Service } from "typedi";
import { ImageRepository } from "@repos/image.repository";
@Service()
export class UserService {
  async getList(request: ListUserRequest) {
    const [users, total] = await UserRepository.getList(request);
    users.forEach((user) => {
      if (user.avartar) {
        user.avartar = JSON.parse(user.avartar);
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
      if (user[key]) {
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
