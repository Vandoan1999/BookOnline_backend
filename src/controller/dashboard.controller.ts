import { Router } from "express";
import { ResponseBuilder } from "src/ultis/response-builder";
import { Container } from "typedi";
const router = Router();

const url = {
  get: "/init",
};

router.post(url.get, async (req, res) => {
  res.json(new ResponseBuilder<object>({}).withSuccess().build());
});

export default router;
