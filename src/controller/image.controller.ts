import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
import { Container } from "typedi";
import { ImageService } from "@services/image.service";
import { verifyToken } from "@middleware/verify-token";
import { verifyUser } from "@middleware/verify-user";
import { upload } from "@common/multer";
import { transformAndValidate } from "../ultis/transformAndValidate";
import { CreateImageRequest } from "@models/images/create-image.request";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { UpdateImageRequest } from "@models/images/update-image.request";
const router = Router();

const url = {
  delete: "/:ids",
  add: "/",
  update: "/",
};

router.put(
  url.update,
  verifyToken,
  upload.single("image"),
  async (req: any, res) => {
    const request = await transformAndValidate<UpdateImageRequest>(
      UpdateImageRequest,
      req.body
    );
    if (!req.file) {
      throw ApiError(StatusCodes.BAD_REQUEST, `Image cannot be empty`);
    }
    request.image = req.file;
    const imageService = Container.get(ImageService);
    await imageService.update(request);
    res.json(
      new ResponseBuilder<any>()
        .withSuccess()
        .withMessage(`Update image success!`)
        .build()
    );
  }
);

router.post(
  url.add,
  verifyToken,
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  async (req: any, res) => {
    const request = await transformAndValidate<CreateImageRequest>(
      CreateImageRequest,
      req.body
    );
    const imageService = Container.get(ImageService);
    if (!req["files"]["images"] && req["files"]["images"].length == 0) {
      throw ApiError(StatusCodes.BAD_REQUEST, `Images cannot be empty`);
    }
    request.images = req["files"]["images"];
    const result = await imageService.create(request);
    res.json(
      new ResponseBuilder<any>(result)
        .withSuccess()
        .withMessage("Create image success!")
        .build()
    );
  }
);

// Export default
export default router;
