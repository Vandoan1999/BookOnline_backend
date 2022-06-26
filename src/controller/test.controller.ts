import { TestingService } from "@services/testing.service";
import { Router } from "express";
import { ResponseBuilder } from "src/ultis/response-builder";
import { Container } from "typedi";
const router = Router();

const url = {
    test: "/",
};

router.get(url.test, async (req, res) => {
    const testingService = Container.get(TestingService);
    await testingService.clear()
    res.json(new ResponseBuilder<any>().withSuccess().withMessage("clear data success").build());

});


// Export default
export default router;
