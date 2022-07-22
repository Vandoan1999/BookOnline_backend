import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
import { transformAndValidate } from "../ultis/transformAndValidate";
import Container from "typedi";
import { verifyToken } from "@middleware/verify-token";
import { ListSupplierRequest } from "@models/supplier/list-supplier.request";
import { SupplierService } from "@services/supplier.service";
import { SupplierEnity } from "@entity/supliers.entity";
import { CreateSupplierRequest } from "@models/supplier/create-supplier.request";
import { UpdateSupplierRequest } from "@models/supplier/update-supplier.request";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { verifyUser } from "@middleware/verify-user";

const router = Router();

const url = {
  get: "/",
  add: "/",
  detail: "/:id",
  delete: "/:id",
  delete_multiple: "/multiple",
  update: "/",
};

router.get(url.get, verifyToken, verifyUser, async (req, res) => {
  const request = await transformAndValidate<ListSupplierRequest>(
    ListSupplierRequest,
    req.query
  );
  const supplierService = Container.get(SupplierService);
  const [supplier, total] = await supplierService.getList(request);
  return res.json(
    new ResponseBuilder<SupplierEnity[]>(supplier)
      .withMeta({ total })
      .withSuccess()
      .build()
  );
});

router.post(url.add, verifyToken, verifyUser, async (req, res) => {
  const request = await transformAndValidate<CreateSupplierRequest>(
    CreateSupplierRequest,
    req.body
  );
  const supplierService = Container.get(SupplierService);
  await supplierService.create(request);
  return res.json(
    new ResponseBuilder()
      .withSuccess()
      .withMessage("create supplier success!")
      .build()
  );
});

router.put(url.update, verifyToken, verifyUser, async (req, res) => {
  const request = await transformAndValidate<UpdateSupplierRequest>(
    UpdateSupplierRequest,
    req.body
  );
  const supplierService = Container.get(SupplierService);
  await supplierService.update(request);
  return res.json(new ResponseBuilder().withSuccess().build());
});

router.delete(
  url.delete_multiple,
  verifyToken,
  verifyUser,
  async (req, res) => {
    const supplierService = Container.get(SupplierService);
    const data = await supplierService.deleteMuiltiple(req);
    return res.json(
      new ResponseBuilder<any>({ supplier_deleted: data }).withSuccess().build()
    );
  }
);

router.delete(url.delete, verifyToken, verifyUser, async (req, res) => {
  if (!req.params.id) throw ApiError(StatusCodes.BAD_REQUEST);
  const supplierService = Container.get(SupplierService);
  const data = await supplierService.delete(req.params.id);
  return res.json(new ResponseBuilder<any>(data).withSuccess().build());
});

router.get(url.detail, verifyToken, verifyUser, async (req, res) => {
  if (!req.params.id) throw ApiError(StatusCodes.BAD_REQUEST);
  const supplierService = Container.get(SupplierService);
  const data = await supplierService.detail(req.params.id);
  return res.json(new ResponseBuilder<any>(data).withSuccess().build());
});

export default router;
