import { Router } from "express";
import { ResponseBuilder } from "src/ultis/response-builder";
import { transformAndValidate } from "src/ultis/transformAndValidate";
import Container from "typedi";
import { verifyToken } from "@middleware/verifyToken";
import { CreateRatingRequest } from "@models/rating/create-rating.request";
import { RatingService } from "@services/rating.service";
const router = Router();

const url = {
  get: "/",
  add: "/",
  detail: "/:id",
  delete: "/:id",
  update: "/:id",
};


//add new book
router.post(url.add, verifyToken, async (req, res) => {
  const request = await transformAndValidate<CreateRatingRequest>(
    CreateRatingRequest,
    req.body
  );
  const bookService = Container.get(RatingService);

  await bookService.create(request);

  return res.json(
    new ResponseBuilder()
      .withSuccess()
      .withMessage("create rating success.")
      .build()
  );
});

// Export default
export default router;
