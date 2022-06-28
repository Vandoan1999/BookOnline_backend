import { Role } from "@enums/role.enum";
import { ListUserRequest } from "@models/user/list-user.request";
import { UpdateUserRequest } from "@models/user/update-user.request";
import { UserInfo } from "@models/user/UserInfo";
import { UserRepository } from "@repos/user.repository";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "src/ultis/apiError";

import { Service } from "typedi";

@Service()
export class UserService {
  constructor() {}

  getList(request: ListUserRequest) {
    return UserRepository.getList(request);
  }

  async update(request: UpdateUserRequest, user: UserInfo) {
    if (user && user.role === Role.USER) {
      request.id = user.id;
    }
    const res = await UserRepository.findBy({ id: request.id });
    if (!res[0]) {
      throw ApiError(StatusCodes.NOT_FOUND, `user with id ${request.id} not found`);
    }
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
    const res = await UserRepository.findBy({ id });
    if (!res[0]) {
      throw ApiError(StatusCodes.NOT_FOUND, `user with id ${id} not found`);
    }
    return res;
  }

  async delete(id: string) {
    const res = await UserRepository.findBy({ id });
    if (!res[0]) {
      throw ApiError(StatusCodes.BAD_REQUEST, `user not found!`);
    }
    if (res[0].role === Role.ADMIN) {
      throw ApiError(StatusCodes.BAD_REQUEST, `you cannot delete admin`);
    }
    return UserRepository.delete({ id });
  }
}
