import { LoginRequest } from "@models/auth/login.request";
import { RegisterRequest } from "@models/auth/register.request";
import { AuthService } from "@services/auth.service";
import { Router } from "express";
import { ResponseBuilder } from "src/ultis/response-builder";
import { transformAndValidate } from "src/ultis/transformAndValidate";
import { Container } from "typedi";
const router = Router();

const url = {
    test: "/test",
};

router.get(url.test, async (req, res) => {
    try {
        res.json({ status: 200 })
    } catch (error) {
        res.json(new ResponseBuilder<any>(error).withError().build());
    }
});


// Export default
export default router;
