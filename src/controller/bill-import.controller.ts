import { Router } from "express";
import { verifyToken } from "@middleware/verify-token";
import { transformAndValidate } from "../ultis/transformAndValidate";
import { CreateBillImportRequest } from "@models/bill_import/create-bill-import.request";
import Container from "typedi";
import { BillImportService } from "@services/bill-import.service";
import { ResponseBuilder } from "../ultis/response-builder";
import { ListBillImportRequest } from "@models/bill_import/list-bill-import.request";
import { UpdateBillImportRequest } from "@models/bill_import/update-bill-import.request";
const router = Router();

const url = {
  add: "/",
  update: "/",
  get: "/",
  detail: "/",
  delete: "/:id",
  init: "/init",
};

router.get(url.get, verifyToken, async (req, res) => {
  const request = await transformAndValidate<ListBillImportRequest>(
    ListBillImportRequest,
    req.query
  );
  const billImportService = Container.get(BillImportService);
  const { billImport, total, link } = await billImportService.list(request);
  return res.json(
    new ResponseBuilder<any>(billImport)
      .withMeta({ total, link })
      .withSuccess()
      .build()
  );
});

router.delete(url.delete, verifyToken, async (req, res) => {
  const billImportService = Container.get(BillImportService);
  await billImportService.delete(req.params.id);
  return res.json(
    new ResponseBuilder<any>()
      .withSuccess()
      .withMessage("delete bill import success!")
      .build()
  );
});

router.get(url.init, verifyToken, async (req, res) => {
  const billImportService = Container.get(BillImportService);
  const result = await billImportService.init();
  return res.json(new ResponseBuilder<any>(result).withSuccess().build());
});

router.post(url.add, verifyToken, async (req, res) => {
  const request = await transformAndValidate<CreateBillImportRequest>(
    CreateBillImportRequest,
    req.body
  );
  const billImportService = Container.get(BillImportService);
  await billImportService.create(request);
  return res.json(
    new ResponseBuilder<any>()
      .withSuccess()
      .withMessage("create bill import success!")
      .build()
  );
});

router.put(url.update, verifyToken, async (req, res) => {
  const request = await transformAndValidate<UpdateBillImportRequest>(
    UpdateBillImportRequest,
    req.body
  );
  const billImportService = Container.get(BillImportService);
  await billImportService.update(request);
  return res.json(
    new ResponseBuilder<any>()
      .withSuccess()
      .withMessage("update bill import success!")
      .build()
  );
});

// Export default
export default router;
