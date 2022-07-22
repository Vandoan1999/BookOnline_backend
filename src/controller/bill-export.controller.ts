import { Router } from "express";
import { verifyToken } from "@middleware/verify-token";
import { transformAndValidate } from "../ultis/transformAndValidate";
import Container from "typedi";
import { ResponseBuilder } from "../ultis/response-builder";
import { CreateBillExportRequest } from "@models/bill_export/create-bill-export.request";
import { BillExportService } from "@services/bill-export.service";
import { ListBillExportRequest } from "@models/bill_export/list-bill-export.request";
import { verifyUser } from "@middleware/verify-user";

const router = Router();

const url = {
  add: "/",
  update: "/",
  get: "/",
  delete: "/:id",
  init: "/init",
};

router.get(url.get, verifyToken, verifyUser, async (req, res) => {
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
  const billExportService = Container.get(BillExportService);
  await billExportService.delete(req.params.id);
  return res.json(new ResponseBuilder<any>().withSuccess().build());
});

router.get(url.init, verifyToken, verifyUser, async (req, res) => {
  const billExportService = Container.get(BillExportService);
  const result = await billExportService.init();
  return res.json(new ResponseBuilder<any>(result).withSuccess().build());
});

router.post(url.add, verifyToken, async (req, res) => {
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
