import { CreateBookRequest } from "@models/book/create-book.request";
import { BookService } from "@services/book.service";
import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
import { transformAndValidate } from "../ultis/transformAndValidate";
import Container from "typedi";
import { verifyToken } from "@middleware/verify-token";
import { ListBookRequest } from "@models/book/list-book.request";
import { BookEntity } from "@entity/book.entity";
import { UpdateBookRequest } from "@models/book/update-book.request";
import { ApiError } from "../ultis/apiError";
import { StatusCodes } from "http-status-codes";
import { verifyUser } from "@middleware/verify-user";

const router = Router();

const url = {
  get: "/",
  add: "/",
  detail: "/:id",
  delete: "/:id",
  update: "/",
  delete_multiple: "/multiple",
};

//get list book
router.get(url.get, async (req, res) => {
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
router.post(url.add, verifyToken, verifyUser, async (req, res) => {
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
router.put(url.update, verifyToken, verifyUser, async (req, res) => {
  const request = await transformAndValidate<UpdateBookRequest>(
    UpdateBookRequest,
    req.body
  );

  const bookService = Container.get(BookService);

  await bookService.update(request);

  return res.json(new ResponseBuilder().withSuccess().build());
});

//get detail book
router.get(url.detail, async (req, res) => {
  if (!req.params.id) {
    throw ApiError(StatusCodes.BAD_REQUEST, "id param empty");
  }

  const bookService = Container.get(BookService);

  const book = await bookService.detail(req.params.id);

  return res.json(new ResponseBuilder<BookEntity>(book).withSuccess().build());
});

//delete multiple
router.delete(
  url.delete_multiple,
  verifyToken,
  verifyUser,
  async (req, res) => {
    const bookService = Container.get(BookService);

    const result = await bookService.delete_multiple(req);

    return res.json(
      new ResponseBuilder<any>({ book_deleted: result }).withSuccess().build()
    );
  }
);

//delete book
router.delete(url.delete, verifyToken, verifyUser, async (req, res) => {
  if (!req.params.id) {
    throw ApiError(StatusCodes.BAD_REQUEST, "id param empty");
  }

  const bookService = Container.get(BookService);

  await bookService.delete(req.params.id);

  return res.json(
    new ResponseBuilder<any>()
      .withSuccess()
      .withMessage("delete book success ")
      .build()
  );
});

// Export default
export default router;
