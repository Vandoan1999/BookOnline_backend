import { Role } from "@enums/role.enum";
import { ListUserRequest } from "@models/user/list-user.request";
import { UpdateUserRequest } from "@models/user/update-user.request";
import { UserInfo } from "@models/user/UserInfo";
import { UserRepository } from "@repos/user.repository";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../ultis/apiError";

import { Service } from "typedi";
import { deleteObject, uploadFile } from "@common/baseAWS";
import { config } from "@config/app";
import { ImageService } from "./image.service";
import { ImageRepository } from "@repos/image.repository";
@Service()
export class UserService {
  constructor(private imageService: ImageService) {}

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
    return UserRepository.save(user);
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
