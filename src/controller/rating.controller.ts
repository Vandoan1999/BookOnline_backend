import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
import { transformAndValidate } from "../ultis/transformAndValidate";
import Container from "typedi";
import { verifyToken } from "@middleware/verify-token";
import { CreateRatingRequest } from "@models/rating/create-rating.request";
import { RatingService } from "@services/rating.service";
import { Role } from "@enums/role.enum";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
const router = Router();

const url = {
  get: "/",
  add: "/",
  detail: "/:id",
  delete: "/:user_id/:book_id",
  update: "/:id",
};

//add | update
router.post(url.add, verifyToken, async (req, res) => {
  const request = await transformAndValidate<CreateRatingRequest>(
    CreateRatingRequest,
    req.body
  );
  if (req["user"].role === Role.USER) {
    request.user_id = req["user"].id;
  }
  const ratingService = Container.get(RatingService);

  const message = await ratingService.createOrUpdate(request);

  return res.json(
    new ResponseBuilder().withSuccess().withMessage(message).build()
  );
});

router.delete(url.delete, verifyToken, async (req, res) => {
  const ratingService = Container.get(RatingService);
  if (!req.params?.book_id || !req.params?.user_id) {
    throw ApiError(StatusCodes.BAD_REQUEST);
  }
  if (req["user"].role === Role.USER) {
    req.params.user_id = req["user"].id;
  }
  await ratingService.delete(req.params.book_id, req.params.user_id);

  return res.json(
    new ResponseBuilder().withSuccess().withMessage("delete success").build()
  );
});

// Export default
export default router;
