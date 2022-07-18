import { Router } from "express";
import { verifyToken } from "@middleware/verifyToken";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { Role } from "@enums/role.enum";
import { transformAndValidate } from "../ultis/transformAndValidate";
import { ListBookRequest } from "@models/book/list-book.request";
import { CreateBillImportRequest } from "@models/bill_import/create-bill-import.request";
import Container from "typedi";
import { BillImportService } from "@services/bill-import.service";
import { ResponseBuilder } from "../ultis/response-builder";
import { ListBillImportRequest } from "@models/bill_import/list-bill-import.request";
import { UpdateBillImportRequest } from "@models/bill_import/update-bill-import.request";
import { CreateBillExportRequest } from "@models/bill_export/create-bill-export.request";
import { BillExportService } from "@services/bill-export.service";
import { ListBillExportRequest } from "@models/bill_export/list-bill-export.request";
import { UpdateBillExportRequest } from "@models/bill_export/update-bill-export.request";
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
  const request = await transformAndValidate<ListBillExportRequest>(
    ListBillExportRequest,
    req.query
  );
  const billExportService = Container.get(BillExportService);
  const [result, total] = await billExportService.list(request);
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

  const billExportService = Container.get(BillExportService);
  await billExportService.delete(req.params.id);
  return res.json(new ResponseBuilder<any>().withSuccess().build());
});

router.get(url.init, verifyToken, async (req, res) => {
  if (req["user"] && req["user"].role === Role.USER) {
    throw ApiError(
      StatusCodes.FORBIDDEN,
      `user name: ${req["user"].username} and email ${req["user"].email} dose not have permission!`
    );
  }

  const billExportService = Container.get(BillExportService);
  const result = await billExportService.init();
  return res.json(new ResponseBuilder<any>(result).withSuccess().build());
});

router.post(url.add, verifyToken, async (req, res) => {
  if (req["user"] && req["user"].role === Role.USER) {
    throw ApiError(
      StatusCodes.FORBIDDEN,
      `user name: ${req["user"].username} and email ${req["user"].email} dose not have permission!`
    );
  }
  const request = await transformAndValidate<CreateBillExportRequest>(
    CreateBillExportRequest,
    req.body
  );
  const billExportService = Container.get(BillExportService);
  await billExportService.create(request, req["user"]);
  return res.json(new ResponseBuilder().withSuccess().build());
});

// Export default
export default router;
