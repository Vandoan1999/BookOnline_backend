import { CreateCategoryRequest } from "@models/category/create-category.request";
import { CategoryService } from "@services/category.service";
import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
import { transformAndValidate } from "../ultis/transformAndValidate";
import { Container } from "typedi";
import { verifyToken } from "@middleware/verify-token";
import { CategoryEntity } from "@entity/category.entity";
import { UpdateCategoryRequest } from "@models/category/update-category.request";
import { verifyUser } from "@middleware/verify-user";

const router = Router();

const url = {
  get: "/",
  detail: "/:id",
  delete: "/:id",
  create: "/",
  update: "/",
};

router.get(url.get, async (req, res) => {
  const categoryService = Container.get(CategoryService);
  const [category, total] = await categoryService.getList();
  res.json(
    new ResponseBuilder<CategoryEntity[]>(category)
      .withSuccess()
      .withMeta({ total: total })
      .build()
  );
});

router.get(url.detail, async (req, res) => {
  const categoryService = Container.get(CategoryService);
  const category = await categoryService.detail(req.params.id);
  res.json(new ResponseBuilder<CategoryEntity>(category).withSuccess().build());
});

router.delete(url.delete, verifyToken, verifyUser, async (req, res) => {
  const categoryService = Container.get(CategoryService);
  const category = await categoryService.delete(req.params.id, req["user"]);
  res.json(new ResponseBuilder<any>(category).withSuccess().build());
});

router.post(url.create, verifyToken, verifyUser, async (req, res) => {
  const request = await transformAndValidate<CreateCategoryRequest>(
    CreateCategoryRequest,
    req.body
  );
  const categoryService = Container.get(CategoryService);
  await categoryService.create(request, req["user"]);
  res.json(new ResponseBuilder<object>().withSuccess().build());
});

router.put(url.update, verifyToken, verifyUser, async (req, res) => {
  const request = await transformAndValidate<UpdateCategoryRequest>(
    UpdateCategoryRequest,
    req.body
  );
  const categoryService = Container.get(CategoryService);
  await categoryService.update(request, req["user"]);
  res.json(new ResponseBuilder<object>().withSuccess().build());
});
export default router;
