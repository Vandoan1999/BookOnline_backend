import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../ultis/apiError";
import { ResponseBuilder } from "../ultis/response-builder";
import { verifyToken } from "@middleware/verifyToken";
import Container from "typedi";
import { DashboardService } from "@services/dashboard.service";
import { Role } from "@enums/role.enum";
const router = Router();

const url = {
  get: "/init",
};

router.get(url.get, verifyToken, async (req, res) => {
  if (req["user"] && req["user"].role === Role.USER) {
    throw ApiError(
      StatusCodes.FORBIDDEN,
      `user name: ${req["user"].username} and email ${req["user"].email} dose not have permission!`
    );
  }

  const dashboardService = Container.get(DashboardService);
  const result = await dashboardService.initData();
  return res.json(new ResponseBuilder<any>(result).withSuccess().build());
});

export default router;
