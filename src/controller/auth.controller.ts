import { LoginRequest } from "@models/auth/login.request";
import { AuthService } from "@services/auth.service";
import { Router } from "express";
import { transformAndValidate } from "src/ultis/transformAndValidate";
import { Container } from "typedi";
const router = Router();

router.post("/login", async (req, res) => {
  const request = await transformAndValidate<LoginRequest>(
    LoginRequest,
    req.body
  );
  const authService = Container.get(AuthService);
  const data = await authService.login(request);
  res.json({ data });
});
// Export default
export default router;
