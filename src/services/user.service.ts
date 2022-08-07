import { Role } from "@enums/role.enum";
import { ListUserRequest } from "@models/user/list-user.request";
import { UpdateUserRequest } from "@models/user/update-user.request";
import { UserInfo } from "@models/user/UserInfo";
import { UserRepository } from "@repos/user.repository";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../ultis/apiError";

import { Service } from "typedi";
import { deleteObject, GetObjectURl, uploadFile } from "@common/baseAWS";
import { config } from "@config/app";

@Service()
export class UserService {
  constructor() {}

  async getList(request: ListUserRequest) {
    const [users, total] = await UserRepository.getList(request);
    users.forEach((user) => {
      if (user.image) {
        user.image = GetObjectURl(user.image);
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
      const newImageName = Math.random() + request.image.originalname;
      await Promise.all([
        deleteObject(config.s3Bucket, config.s3BucketForder + user.image),
        uploadFile(
          request.image.buffer,
          config.s3Bucket,
          request.image.mimetype,
          config.s3BucketForder + newImageName
        ),
      ]);

      request.image = newImageName;
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
    const res = await UserRepository.findOneByOrFail({ id });
    if (res.image) {
      res.image = GetObjectURl(res.image);
    }
    return res;
  }

  async delete(id: string) {
    const res = await UserRepository.findOneByOrFail({ id });
    if (res.role === Role.ADMIN) {
      throw ApiError(StatusCodes.BAD_REQUEST, `you cannot delete admin`);
    }
    if (res.image) {
      await deleteObject(config.s3Bucket, config.s3BucketForder + res.image);
    }
    return UserRepository.delete({ id });
  }
}
