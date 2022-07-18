import { Router } from "express";
import { verifyToken } from "@middleware/verifyToken";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { Role } from "@enums/role.enum";
import { transformAndValidate } from "../ultis/transformAndValidate";
import { CreateBillImportRequest } from "@models/bill_import/create-bill-import.request";
import Container from "typedi";
import { BillImportService } from "@services/bill-import.service";
import { ResponseBuilder } from "../ultis/response-builder";
import { ListBillImportRequest } from "@models/bill_import/list-bill-import.request";
const router = Router();

const url = {
  add: "/",
  update: "/",
  get: "/",
  delete: "/:id",
  init: "/init",
};

router.get(url.get, verifyToken, async (req, res) => {
  if (req["user"] && req["user"].role === Role.USER) {
    throw ApiError(
      StatusCodes.FORBIDDEN,
      `user name: ${req["user"].username} and email ${req["user"].email} dose not have permission!`
    );
  }
  const request = await transformAndValidate<ListBillImportRequest>(
    ListBillImportRequest,
    req.query
  );
  const billImportService = Container.get(BillImportService);
  const [result, total] = await billImportService.list(request);
  return res.json(
    new ResponseBuilder<any>(result).withMeta({ total }).withSuccess().build()
  );
});

router.delete(url.delete, verifyToken, async (req, res) => {
  if (req["user"] && req["user"].role === Role.USER) {
    throw ApiError(
      StatusCodes.FORBIDDEN,
      `user name: ${req["user"].username} and email ${req["user"].email} dose not have permission!`
    );
  }

  const billImportService = Container.get(BillImportService);
  await billImportService.delete(req.params.id);
  return res.json(new ResponseBuilder<any>().withSuccess().build());
});

router.get(url.init, verifyToken, async (req, res) => {
  if (req["user"] && req["user"].role === Role.USER) {
    throw ApiError(
      StatusCodes.FORBIDDEN,
      `user name: ${req["user"].username} and email ${req["user"].email} dose not have permission!`
    );
  }
  const billImportService = Container.get(BillImportService);
  const result = await billImportService.init();
  return res.json(new ResponseBuilder<any>(result).withSuccess().build());
});

router.post(url.add, verifyToken, async (req, res) => {
  if (req["user"] && req["user"].role === Role.USER) {
    throw ApiError(
      StatusCodes.FORBIDDEN,
      `user name: ${req["user"].username} and email ${req["user"].email} dose not have permission!`
    );
  }
  const request = await transformAndValidate<CreateBillImportRequest>(
    CreateBillImportRequest,
    req.body
  );
  const billImportService = Container.get(BillImportService);
  await billImportService.create(request);
  return res.json(new ResponseBuilder<any>().withSuccess().build());
});

// Export default
export default router;
