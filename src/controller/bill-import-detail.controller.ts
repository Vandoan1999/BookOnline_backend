import { Router } from "express";
import { verifyToken } from "@middleware/verify-token";
import Container from "typedi";
import { ResponseBuilder } from "../ultis/response-builder";
import { BillImportDetailService } from "@services/bill-import-detail.service";
import { transformAndValidate } from "../ultis/transformAndValidate";
import { UpdateBillImportDetailRequest } from "@models/bill_import_detail/update-bill-import-detail.request";
import { CreateBillImportDetailRequest } from "@models/bill_import_detail/add-bill-import-detail.request";

const router = Router();

const url = {
  delete: "/:book_id/:bill_import_id",
  update: "/",
  add: "/",
};

router.delete(url.delete, verifyToken, async (req, res) => {
  const billImportDetailService = Container.get(BillImportDetailService);
  await billImportDetailService.delete(
    req.params?.book_id,
    req.params?.bill_import_id
  );
  return res.json(
    new ResponseBuilder<any>()
      .withSuccess()
      .withMessage("delete bill import detail success !")
      .build()
  );
});

router.put(url.update, verifyToken, async (req, res) => {
  const request = await transformAndValidate<UpdateBillImportDetailRequest>(
    UpdateBillImportDetailRequest,
    req.body
  );
  const billImportDetailService = Container.get(BillImportDetailService);
  await billImportDetailService.update(request);
  return res.json(
    new ResponseBuilder<any>()
      .withSuccess()
      .withMessage("update bill import detail success !")
      .build()
  );
});

router.post(url.add, verifyToken, async (req, res) => {
  const request = await transformAndValidate<CreateBillImportDetailRequest>(
    CreateBillImportDetailRequest,
    req.body
  );
  const billImportDetailService = Container.get(BillImportDetailService);
  await billImportDetailService.create(request);
  return res.json(
    new ResponseBuilder<any>()
      .withSuccess()
      .withMessage("update bill import detail success !")
      .build()
  );
});

export default router;
