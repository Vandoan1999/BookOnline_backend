import { CreateBookRequest } from "@models/book/create-book.request";
import { BookRepository } from "@repos/book.repository";
import { Service } from "typedi";

@Service()
export class BookService {
  constructor() {}
  Create(request: CreateBookRequest) {
    const book = Object.assign(BookRepository.create(), request);
    return BookRepository.save(book);
  }
}
