import { Router } from "express";
import { verifyToken } from "@middleware/verifyToken";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { Role } from "@enums/role.enum";
import Container from "typedi";
import { BillImportService } from "@services/bill-import.service";
import { ResponseBuilder } from "../ultis/response-builder";
import { BillImportDetailService } from "@services/bill-import-detail.service";
const router = Router();

const url = {
  delete: "/:id",
};

router.delete(url.delete, verifyToken, async (req, res) => {
  if (req["user"] && req["user"].role === Role.USER) {
    throw ApiError(
      StatusCodes.FORBIDDEN,
      `user name: ${req["user"].username} and email ${req["user"].email} dose not have permission!`
    );
  }

  const billImportDetailService = Container.get(BillImportDetailService);
  await billImportDetailService.delete(
    req.params.book_id,
    req.params.bill_import_id
  );
  return res.json(new ResponseBuilder<any>().withSuccess().build());
});
