import { Router } from "express";
import { verifyToken } from "@middleware/verify-token";
import Container from "typedi";
import { ResponseBuilder } from "../ultis/response-builder";
import { BillImportDetailService } from "@services/bill-import-detail.service";
import { verifyUser } from "@middleware/verify-user";

const router = Router();

const url = {
  delete: "/:book_id/:bill_export_id",
};

router.delete(url.delete, verifyToken, verifyUser, async (req, res) => {
  const billExportDetailService = Container.get(BillImportDetailService);
  await billExportDetailService.delete(
    req.params?.book_id,
    req.params?.bill_export_id
  );
  return res.json(
    new ResponseBuilder<any>()
      .withSuccess()
      .withMessage("delete bill export detail success !")
      .build()
  );
});

export default router;
