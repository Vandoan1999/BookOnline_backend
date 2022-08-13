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
@Service()
export class UserService {
  constructor(private imageService: ImageService) {}

  async getList(request: ListUserRequest) {
    const [users, total] = await UserRepository.getList(request);

    return { users: await this.imageService.getImageByObject(users), total };
  }

  async update(request: UpdateUserRequest, userInfo: UserInfo) {
    if (userInfo && userInfo.role === Role.USER) {
      request.id = userInfo.id;
    }
    await UserRepository.findOneByOrFail({ id: request.id });
    return UserRepository.update(
      { id: request.id },
      {
        ...request,
      }
    );
  }

  async detail(id: string, user: UserInfo | null = null) {
    if (user && user.role === Role.USER) {
      id = user && user?.id ? user?.id : id;
    }
    const userResult = await UserRepository.findOneByOrFail({ id });
    return await this.imageService.getImageByObject([userResult]);
  }

  async delete(id: string) {
    const res = await UserRepository.findOneByOrFail({ id });
    if (res.role === Role.ADMIN) {
      throw ApiError(StatusCodes.BAD_REQUEST, `you cannot delete admin`);
    }
    await this.imageService.delete(null, res.id);
  }
}
