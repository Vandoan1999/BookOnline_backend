import { ListUserRequest } from "@models/user/list-user.request";
import { UpdateUserRequest } from "@models/user/update-user.request";
import { UserRepository } from "@repos/user.repository";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "src/ultis/apiError";

import { Service } from "typedi";

@Service()
export class UserService {

  constructor() { }

  getList(request: ListUserRequest) {
    return UserRepository.getList(request)
  }

  update(request: UpdateUserRequest, id: string) {
    return UserRepository.update({ id }, {
      ...request
    })
  }


  async detail(id: string) {
    const res = await UserRepository.findOne(id as any)
    if (!res) {
      throw ApiError(StatusCodes.NOT_FOUND, `user with id ${id} not found`);
    }
    return res
  }

  delete(id: string) {
    return UserRepository.delete(id)
  }

}
