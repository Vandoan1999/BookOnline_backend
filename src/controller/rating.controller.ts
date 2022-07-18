import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
import { transformAndValidate } from "../ultis/transformAndValidate";
import Container from "typedi";
import { verifyToken } from "@middleware/verifyToken";
import { CreateRatingRequest } from "@models/rating/create-rating.request";
import { RatingService } from "@services/rating.service";
import { UpdateRatingRequest } from "@models/rating/update-rating.request";
const router = Router();

const url = {
  get: "/",
  add: "/",
  detail: "/:id",
  delete: "/:id",
  update: "/:id",
};

//add new book
router.post(url.add, async (req, res) => {
  const request = await transformAndValidate<CreateRatingRequest>(
    CreateRatingRequest,
    req.body
  );
  const ratingService = Container.get(RatingService);

  await ratingService.create(request);

  return res.json(
    new ResponseBuilder()
      .withSuccess()
      .withMessage("create rating success.")
      .build()
  );
});

router.put(url.update, async (req, res) => {
  const request = await transformAndValidate<UpdateRatingRequest>(
    UpdateRatingRequest,
    req.body
  );
  const ratingService = Container.get(RatingService);

  await ratingService.create(request);

  return res.json(
    new ResponseBuilder()
      .withSuccess()
      .withMessage("create rating success.")
      .build()
  );
});

// Export default
export default router;
