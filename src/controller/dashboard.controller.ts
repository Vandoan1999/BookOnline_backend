import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
const router = Router();

const url = {
  get: "/init",
};

router.post(url.get, async (req, res) => {
  res.json(new ResponseBuilder<object>({}).withSuccess().build());
});

export default router;
