import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../ultis/apiError";
import { ResponseBuilder } from "../ultis/response-builder";
import Container from "typedi";
import { DashboardService } from "@services/dashboard.service";
import { Role } from "@enums/role.enum";
import { verifyToken } from "@middleware/verify-token";
const router = Router();

const url = {
  get: "/init",
};

router.get(url.get, verifyToken, async (req, res) => {
  const dashboardService = Container.get(DashboardService);
  const result = await dashboardService.initData();
  return res.json(new ResponseBuilder<any>(result).withSuccess().build());
});

export default router;
