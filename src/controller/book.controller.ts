import { CreateBookRequest } from "@models/book/create-book.request";
import { BookService } from "@services/book.service";
import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
import { transformAndValidate } from "../ultis/transformAndValidate";
import Container from "typedi";
import { verifyToken } from "@middleware/verifyToken";
import { ListBookRequest } from "@models/book/list-book.request";
import { BookEntity } from "@entity/book.entity";
import { UpdateBookRequest } from "@models/book/update-book.request";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
const router = Router();

const url = {
  get: "/",
  add: "/",
  detail: "/:id",
  delete: "/:id",
  update: "/",
};

//get list book
router.get(url.get, verifyToken, async (req, res) => {
  const request = await transformAndValidate<ListBookRequest>(
    ListBookRequest,
    req.query
  );
  const bookService = Container.get(BookService);
  const { data, total } = await bookService.getList(request);
  return res.json(
    new ResponseBuilder<BookEntity[]>(data)
      .withMeta({ total })
      .withSuccess()
      .build()
  );
});

//add new book
router.post(url.add, verifyToken, async (req, res) => {
  const request = await transformAndValidate<CreateBookRequest>(
    CreateBookRequest,
    req.body
  );
  const bookService = Container.get(BookService);

  await bookService.create(request);

  return res.json(
    new ResponseBuilder()
      .withSuccess()
      .withMessage("create product success.")
      .build()
  );
});

//update book
router.put(url.update, verifyToken, async (req, res) => {
  const request = await transformAndValidate<UpdateBookRequest>(
    UpdateBookRequest,
    req.body
  );

  const bookService = Container.get(BookService);

  await bookService.update(request);

  return res.json(
    new ResponseBuilder()
      .withSuccess()
      .withMessage("update product success.")
      .build()
  );
});

//get detail book
router.get(url.detail, verifyToken, async (req, res) => {
  if (!req.params.id) {
    throw ApiError(StatusCodes.BAD_REQUEST, "id param empty");
  }

  const bookService = Container.get(BookService);

  const book = await bookService.detail(req.params.id);

  return res.json(new ResponseBuilder<BookEntity>(book).withSuccess().build());
});

//delete book
router.delete(url.delete, verifyToken, async (req, res) => {
  if (!req.params.id) {
    throw ApiError(StatusCodes.BAD_REQUEST, "id param empty");
  }

  const bookService = Container.get(BookService);

  const result = await bookService.delete(req.params.id);

  return res.json(new ResponseBuilder<any>(result).withSuccess().build());
});

// Export default
export default router;
