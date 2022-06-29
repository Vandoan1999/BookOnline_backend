import { CreateCategoryRequest } from "@models/category/create-category.request";
import { CategoryService } from "@services/category.service";
import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
import { transformAndValidate } from "../ultis/transformAndValidate";
import { Container } from "typedi";
import { verifyToken } from "@middleware/verifyToken";
import { CategoryEntity } from "@entity/category.entity";

const router = Router();

const url = {
  get: "/",
  detail: "/:id",
  create: "/",
  update: "/",
};

router.get(url.get, verifyToken, async (req, res) => {
  const categoryService = Container.get(CategoryService);
  const [category, total] = await categoryService.getList();
  res.json(new ResponseBuilder<CategoryEntity[]>(category).withSuccess().withMeta({ total: total }).build());
});

router.get(url.detail, verifyToken, async (req, res) => {
  const categoryService = Container.get(CategoryService);
  const category = await categoryService.detail(req.params.id);
  res.json(new ResponseBuilder<CategoryEntity>(category).withSuccess().build());
});

router.post(url.create, verifyToken, async (req, res) => {
  const request = await transformAndValidate<CreateCategoryRequest>(CreateCategoryRequest, req.body);
  const categoryService = Container.get(CategoryService);
  await categoryService.create(request, req["user"]);
  res.json(new ResponseBuilder<object>().withSuccess().build());
});

router.put(url.update, verifyToken, async (req, res) => {
  const request = await transformAndValidate<CreateCategoryRequest>(CreateCategoryRequest, req.body);
  const categoryService = Container.get(CategoryService);
  await categoryService.create(request, req["user"]);
  res.json(new ResponseBuilder<object>().withSuccess().build());
});
export default router;
