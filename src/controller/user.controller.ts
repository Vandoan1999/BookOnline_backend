import { CreateBookRequest } from "@models/book/create-book.request";
import { BookService } from "@services/book.service";
import { Router } from "express";
import { ResponseBuilder } from "src/ultis/response-builder";
import { transformAndValidate } from "src/ultis/transformAndValidate";
import Container from "typedi";
import { verifyToken } from "@middleware/verifyToken";
import { BookEntity } from "@entity/book.entity";
import { ApiError } from "src/ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { ListUserRequest } from "@models/user/list-user.request";
import { UserService } from "@services/user.service";
import { UserEntity } from "@entity/user.entity";
import { UpdateUserRequest } from "@models/user/update-user.request";
import { Role } from "@enums/role.enum";
const router = Router();

const url = {
  get: "/",
  add: "/",
  detail: "/:id",
  delete: "/:id",
  update: "",
};

router.get(url.get, verifyToken, async (req, res) => {
  const request = await transformAndValidate<ListUserRequest>(ListUserRequest, req.query);
  const userService = Container.get(UserService);
  if (req["user"] && req["user"].role === Role.USER) {
    throw ApiError(StatusCodes.FORBIDDEN, `user name: ${req["user"].username} and email ${req["user"].email} not have permission!`);
  }
  const [books, total] = await userService.getList(request);
  return res.json(new ResponseBuilder<UserEntity[]>(books).withMeta({ total }).withSuccess().build());
});

router.put(url.update, verifyToken, async (req, res) => {
  const request = await transformAndValidate<UpdateUserRequest>(UpdateUserRequest, req.body);

  const userService = Container.get(UserService);

  await userService.update(request, req["user"]);

  return res.json(new ResponseBuilder().withSuccess().withMessage("update user success").build());
});

router.get(url.detail, verifyToken, async (req, res) => {
  const userService = Container.get(UserService);
  const user = await userService.detail(req.params.id, req["user"]);

  return res.json(new ResponseBuilder<UserEntity>(user[0]).withSuccess().build());
});

router.delete(url.delete, verifyToken, async (req, res) => {
  if (req["user"] && req["user"].role === Role.USER) {
    throw ApiError(StatusCodes.FORBIDDEN, `user name: ${req["user"].username} and email ${req["user"].email} not have permission delete user!`);
  }
  const userService = Container.get(UserService);

  const result = await userService.delete(req.params.id);

  return res.json(new ResponseBuilder<any>(result).withSuccess().build());
});

// Export default
export default router;
