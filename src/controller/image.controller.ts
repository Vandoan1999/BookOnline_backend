import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
import { Container } from "typedi";
import { ImageService } from "@services/image.service";
import { verifyToken } from "@middleware/verify-token";
import { verifyUser } from "@middleware/verify-user";
const router = Router();

const url = {
  delete: "/:ids",
};

router.delete(url.delete, verifyToken, verifyUser, async (req, res) => {
  const imageService = Container.get(ImageService);
  await imageService.delete(req.params.ids);
  res.json(
    new ResponseBuilder<any>()
      .withSuccess()
      .withMessage(`Deleted image ${req.params.id} !`)
      .build()
  );
});

// Export default
export default router;
