import { ListUserRequest } from "@models/user/list-user.request";
import { UserRepository } from "@repos/user.repository";

import { Service } from "typedi";

@Service()
export class UserService {
  constructor() { }

  getList(request: ListUserRequest) {
    return UserRepository.getList(request)
  }

}
