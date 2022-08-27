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
import { ImageRepository } from "@repos/image.repository";

@Service()
export class BookService {
  constructor(private imageService: ImageService) {}
  async create(request: CreateBookRequest) {
    const book = BookRepository.create(request);

    if (request.categories_id && request.categories_id.length > 0) {
      const categories = await CategoryRepository.find({
        where: { id: In([...request.categories_id]) },
      });
      const invalidCategory: any[] = [];
      for (const cate of categories) {
        const category = request.categories_id.findIndex((i) => i === cate.id);
        if (category === -1) {
          invalidCategory.push(cate.id);
        }
      }
      if (invalidCategory.length > 0) {
        if (invalidCategory.length > 0) {
          throw ApiError(StatusCodes.NOT_FOUND, `categories invalid`, {
            invalidCategory,
          });
        }
      }
      book.categories = categories;
    }

    if (request.images && request.images.length > 0) {
      const image = await ImageRepository.find({
        where: { id: In(request.images.map((i) => i.id)) },
      });

      if (image.length !== request.images.length) {
        throw ApiError(StatusCodes.NOT_FOUND, `Image not exits`, {});
      }
      book.images = JSON.stringify(image);
    }

    if (request.avartar) {
      const image = await ImageRepository.findOneOrFail({
        where: { id: request.avartar.id },
      });
      book.avartar = JSON.stringify(image);
    }

    const bookAfterSave = await BookRepository.save(book);
    if (bookAfterSave.avartar) {
      bookAfterSave.avartar = JSON.parse(bookAfterSave.avartar);
    }

    if (bookAfterSave.images) {
      bookAfterSave.images = JSON.parse(bookAfterSave.images);
    }

    return bookAfterSave;
  }

  async getList(request: ListBookRequest) {
    const [books, total] = await BookRepository.getList(request);
    books.forEach((book) => {
      if (book.avartar) {
        book.avartar = JSON.parse(book.avartar);
      }

      if (book.images) {
        book.images = JSON.parse(book.images);
      }
    });
    return {
      books,
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
        if (key === "images") {
          continue;
        }

        if (key === "avartar") {
          continue;
        }
        book[key] = request[key];
      }
    }

    if (request.images && request.images.length > 0) {
      const image = await ImageRepository.find({
        where: { id: In(request.images.map((i) => i.id)) },
      });

      if (image.length !== request.images.length) {
        throw ApiError(StatusCodes.NOT_FOUND, `Image not exits`, {});
      }
      book.images = JSON.stringify(image);
    }

    if (request.avartar) {
      const image = await ImageRepository.findOneOrFail({
        where: { id: request.avartar.id },
      });
      book.avartar = JSON.stringify(image);
    }

    const bookAfterSave = await BookRepository.save(book);
    if (bookAfterSave.avartar) {
      bookAfterSave.avartar = JSON.parse(bookAfterSave.avartar);
    }

    if (bookAfterSave.images) {
      bookAfterSave.images = JSON.parse(bookAfterSave.images);
    }

    return bookAfterSave;
  }

  async detail(id: string) {
    const book = await BookRepository.findOneOrFail({
      where: { id },
      relations: ["categories"],
    });

    if (book.avartar) {
      book.avartar = JSON.parse(book.avartar);
    }

    if (book.images) {
      book.images = JSON.parse(book.images);
    }
    return book;
  }

  async delete(idsRequest: string) {
    let ids: any[] = idsRequest.split(",");
    const books = await BookRepository.find({ where: { id: In(ids) } });
    const imageTobeDelete: any[] = [];
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

      if (book.avartar) {
        imageTobeDelete.push(JSON.parse(book.avartar).id);
      }
      if (book.images) {
        imageTobeDelete.push(...JSON.parse(book.images).map((i) => i.id));
      }
    }

    if (invalidBook.length > 0) {
      throw ApiError(StatusCodes.NOT_FOUND, `book id not valid`, {
        invalidBook,
      });
    }
    logger.info(`Start delete book from db! `);
    await BookRepository.remove(books);
    logger.info(`Deleted book from db done! `);
    await this.imageService.delete(imageTobeDelete);
  }
}
