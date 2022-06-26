import { LoginRequest } from "@models/auth/login.request";
import { RegisterRequest } from "@models/auth/register.request";
import { AuthService } from "@services/auth.service";
import { Router } from "express";
import { ResponseBuilder } from "src/ultis/response-builder";
import { transformAndValidate } from "src/ultis/transformAndValidate";
import { Container } from "typedi";
const router = Router();

const url = {
  login: "/login",
  register: "/register",
};

router.post(url.login, async (req, res) => {
  const request = await transformAndValidate<LoginRequest>(LoginRequest, req.body);
  const authService = Container.get(AuthService);
  const token = await authService.login(request);
  res.json(new ResponseBuilder<object>({ accessToken: token, refeshToken: "" }).withSuccess().build());

});

router.post(url.register, async (req, res) => {
  const request = await transformAndValidate<RegisterRequest>(RegisterRequest, req.body);
  const authService = Container.get(AuthService);
  await authService.register(request);
  res.json(new ResponseBuilder().withSuccess().withMessage("create account success").build());
});
// Export default
export default router;
