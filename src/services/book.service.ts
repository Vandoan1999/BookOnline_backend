import { CreateBookRequest } from "@models/book/create-book.request";
import { ListBookRequest } from "@models/book/list-book.request";
import { UpdateBookRequest } from "@models/book/update-book.request";
import { BookRepository } from "@repos/book.repository";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../ultis/apiError";
import { Service } from "typedi";
import { CategoryRepository } from "@repos/category.repository";
import { In } from "typeorm";

import logger from "jet-logger";
import { ImageService } from "./image.service";

@Service()
export class BookService {
  constructor(private imageService: ImageService) {}
  async create(request: CreateBookRequest) {
    const bookExist = await BookRepository.findOneBy({ name: request.name });
    if (bookExist) {
      throw ApiError(
        StatusCodes.BAD_REQUEST,
        `name: ${request.name} book existed!`
      );
    }
    const book = BookRepository.create(request);

    if (request.categories_id && request.categories_id.length > 0) {
      const categories: any[] = [];
      for (let i = 0; i < request.categories_id.length; i++) {
        const data = await CategoryRepository.findOne({
          where: { id: request.categories_id[i] },
        });
        if (data) {
          categories.push(data);
        }
      }

      book.categories = categories;
    }

    return BookRepository.save(book);
  }

  async getList(request: ListBookRequest) {
    const [books, total] = await BookRepository.getList(request);
    return {
      books: await this.imageService.getImageByObject(books),
      total,
    };
  }

  async update(request: UpdateBookRequest) {
    const book = await BookRepository.findOneOrFail({
      where: { id: request.id },
      relations: ["categories"],
    });

    if (request.categories_id) {
      const categories = await CategoryRepository.find({
        where: { id: In(request.categories_id) },
      });
      const invalidCategory: any[] = [];
      for (const ct of categories) {
        const category = request.categories_id.find((i) => i == ct.id);
        if (!category) {
          invalidCategory.push(category);
        }
      }
      if (invalidCategory.length > 0) {
        throw ApiError(StatusCodes.NOT_FOUND, `categories invalid`, {
          invalidCategory,
        });
      }
      book.categories = categories;
    }
    for (const key in request) {
      if (book.hasOwnProperty(key)) {
        if (key === "sold") {
          book[key] += 1;
          continue;
        }
        if (key === "views") {
          book[key] += 1;
          continue;
        }
        book[key] = request[key];
      }
    }
    return BookRepository.save(book);
  }

  async detail(id: string) {
    const book = await BookRepository.findOneOrFail({
      where: { id },
      relations: ["categories"],
    });
    for (let ct of book.categories) {
      const category = await this.imageService.getImageByObject([ct]);
      ct = category[0];
    }
    return this.imageService.getImageByObject([book]);
  }

  async delete(idsRequest: string) {
    let ids: any[] = idsRequest.split(",");
    const books = await BookRepository.find({ where: { id: In(ids) } });
    if (books.length === 0) {
      throw ApiError(
        StatusCodes.NOT_FOUND,
        `book width ids ${ids.toString()} not found`
      );
    }
    const invalidBook: any[] = [];
    for (const book of books) {
      const id = ids.find((id) => id === book.id);
      if (!id) {
        invalidBook.push(book.id);
      }
    }

    if (invalidBook.length > 0) {
      throw ApiError(StatusCodes.NOT_FOUND, `book id not valid`, {
        invalidBook,
      });
    }
    const idBook = books.map((item) => item.id);
    logger.info(`Start delete book from db! `);
    await BookRepository.remove(books);
    logger.info(`Deleted book from db done! `);

    await this.imageService.delete(null, idBook.toString());
  }
}
