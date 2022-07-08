import { LoginRequest } from "@models/auth/login.request";
import { RegisterRequest } from "@models/auth/register.request";
import { AuthService } from "@services/auth.service";
import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
import { transformAndValidate } from "../ultis/transformAndValidate";
import { Container } from "typedi";
import { verifyToken } from "@middleware/verifyToken";
const router = Router();

const url = {
  login: "/login",
  register: "/register",
  profile: "/profile",
};

router.post(url.login, async (req, res) => {
  const request = await transformAndValidate<LoginRequest>(
    LoginRequest,
    req.body
  );
  const authService = Container.get(AuthService);
  const token = await authService.login(request);
  res.json(
    new ResponseBuilder<object>({ accessToken: token, refeshToken: "" })
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
      .withMessage("create account success")
      .build()
  );
});

router.get(url.profile, verifyToken, async (req, res) => {
  const authService = Container.get(AuthService);
  const user = await authService.getProfile(req["user"]);
  res.json(
    new ResponseBuilder(user)
      .withSuccess()
      .withMessage("create account success")
      .build()
  );
});
// Export default
export default router;
