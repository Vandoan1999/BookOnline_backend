import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
import { transformAndValidate } from "../ultis/transformAndValidate";
import Container from "typedi";
import { verifyToken } from "@middleware/verify-token";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { ListUserRequest } from "@models/user/list-user.request";
import { UserService } from "@services/user.service";
import { UserEntity } from "@entity/user.entity";
import { UpdateUserRequest } from "@models/user/update-user.request";
import { Role } from "@enums/role.enum";
import { upload } from "@common/multer";
const router = Router();

const url = {
  get: "/",
  add: "/",
  detail: "/:id",
  delete: "/:id",
  update: "",
};

router.get(url.get, verifyToken, async (req, res) => {
  const request = await transformAndValidate<ListUserRequest>(
    ListUserRequest,
    req.query
  );
  const userService = Container.get(UserService);
  const { users, total } = await userService.getList(request);
  return res.json(
    new ResponseBuilder<UserEntity[]>(users)
      .withMeta({ total })
      .withSuccess()
      .build()
  );
});

router.put(url.update, verifyToken, async (req: any, res) => {
  const request = await transformAndValidate<UpdateUserRequest>(
    UpdateUserRequest,
    req.body
  );

  const userService = Container.get(UserService);
  await userService.update(request, req["user"]);

  return res.json(
    new ResponseBuilder()
      .withSuccess()
      .withMessage("update user success")
      .build()
  );
});

router.get(url.detail, verifyToken, async (req, res) => {
  const userService = Container.get(UserService);
  const user = await userService.detail(req.params.id, req["user"]);
  return res.json(new ResponseBuilder<UserEntity>(user).withSuccess().build());
});

// Export default
export default router;
