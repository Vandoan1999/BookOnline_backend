import { CreateBookRequest } from "@models/book/create-book.request";
import { BookService } from "@services/book.service";
import { Router } from "express";
import { ResponseBuilder } from "src/ultis/response-builder";
import { transformAndValidate } from "src/ultis/transformAndValidate";
import Container from "typedi";
import { verifyToken } from "@middleware/verifyToken";
const router = Router();

const url = {
  list: "/",
  add: "/",
  detail: "/:id",
  delete: "/:id",
  update: "/",
};
router.post(url.add, verifyToken, async (req, res) => {
  try {
    const request = await transformAndValidate<CreateBookRequest>(CreateBookRequest, req.body);
    const bookService = Container.get(BookService);

    await bookService.Create(request);

    return res.json(new ResponseBuilder().withSuccess().withMessage("create product success.").build());
  } catch (error) {
    return res.json(new ResponseBuilder<any>(error).withError().build());
  }
});

// Export default
export default router;
