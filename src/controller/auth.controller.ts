import { LoginRequest } from "@models/auth/login.request";
import { RegisterRequest } from "@models/auth/register.request";
import { AuthService } from "@services/auth.service";
import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
import { transformAndValidate } from "../ultis/transformAndValidate";
import { Container } from "typedi";
import { verifyToken } from "@middleware/verify-token";
import { ChangePasswordRequest } from "@models/auth/change-password.request";
const router = Router();

const url = {
  login: "/login",
  register: "/register",
  profile: "/profile",
  forgot_password: "/forgot-password",
  change_password: "/change-password",
};

router.post(url.login, async (req, res) => {
  const request = await transformAndValidate<LoginRequest>(
    LoginRequest,
    req.body
  );
  const authService = Container.get(AuthService);
  const token = await authService.login(request);
  res.json(
    new ResponseBuilder<object>({ accessToken: token }).withSuccess().build()
  );
});

router.post(url.forgot_password, async (req, res) => {
  const authService = Container.get(AuthService);
  await authService.forgotPassword(req.body.email ? req.body.email : "");
  res.json(
    new ResponseBuilder()
      .withMessage("Password was successfully reseted!")
      .withSuccess()
      .build()
  );
});

router.post(url.change_password, async (req, res) => {
  const request = await transformAndValidate<ChangePasswordRequest>(
    ChangePasswordRequest,
    req.body
  );
  const authService = Container.get(AuthService);
  await authService.changePassword(request);
  res.json(
    new ResponseBuilder()
      .withMessage("Password was successfully changed")
      .withSuccess()
      .build()
  );
});

router.post(url.register, async (req, res) => {
  const request = await transformAndValidate<RegisterRequest>(
    RegisterRequest,
    req.body
  );
  const authService = Container.get(AuthService);
  await authService.register(request);
  res.json(
    new ResponseBuilder()
      .withSuccess()
      .withMessage("Account has been created successfully")
      .build()
  );
});

router.get(url.profile, verifyToken, async (req, res) => {
  const authService = Container.get(AuthService);
  const user = await authService.getProfile(req["user"]);
  res.json(new ResponseBuilder(user).withSuccess().build());
});
// Export default
export default router;
