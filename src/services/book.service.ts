import { BooksEntity as BookEntity } from "@entity/book.entity";
import { CreateBookRequest } from "@models/book/create-book.request";
import { ListBookRequest } from "@models/book/list-book.request";
import { UpdateBookRequest } from "@models/book/update-book.request";
import { BookRepository } from "@repos/book.repository";
import { plainToClass } from "class-transformer";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "src/ultis/apiError";
import { Service } from "typedi";

@Service()
export class BookService {
  constructor() { }
  create(request: CreateBookRequest) {
    const book = Object.assign(BookRepository.create(), request);
    return BookRepository.save(book);
  }

  getList(request: ListBookRequest) {
    return BookRepository.getList(request)
  }

  update(request: UpdateBookRequest, id: string) {
    const book = plainToClass(UpdateBookRequest, request)
    return BookRepository.update(
      {
        id
      },
      book
    )
  }

  async detail(id: string) {
    const book = await BookRepository.findOneBy({ id })
    if (!book)
      throw ApiError(StatusCodes.NOT_FOUND, `product width id ${id} not found`);
    return book
  }
}
