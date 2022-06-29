import { BookEntity } from "@entity/book.entity";
import { CreateBookRequest } from "@models/book/create-book.request";
import { ListBookRequest } from "@models/book/list-book.request";
import { UpdateBookRequest } from "@models/book/update-book.request";
import { BookRepository } from "@repos/book.repository";
import { plainToClass } from "class-transformer";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../ultis/apiError";
import { Service } from "typedi";
import { ImageRepository } from "@repos/image.repository";
import { ImageEntity } from "@entity/image.entity";
@Service()
export class BookService {
  constructor() {}
  async create(request: CreateBookRequest) {
    const book = Object.assign(BookRepository.create(), request);
    const bookSaved = await BookRepository.save(book);
    const images = request.images;

    const imageTobeinsert: ImageEntity[] = images.map((item) => {
      return {
        url: item,
        order: Math.floor(Math.random() * images.length),
        book_id: bookSaved,
      };
    });
    ImageRepository.insert(imageTobeinsert);
    return BookRepository.save(book);
  }

  async getList(request: ListBookRequest) {
    const result = await BookRepository.getList(request);
    result.entities.forEach((item, index) => {
      item["rating_number"] = result.raw[index]["rating_number"] || 0;
    });
    const total = await BookRepository.count();

    return {
      data: result.entities,
      total,
    };
  }

  update(request: UpdateBookRequest, id: string) {
    let images: {
      id: string;
      url: string;
    }[] = [];
    if (request.images && request.images.length > 0) {
      images = request.images;
      delete request.images;
    }
    const book = plainToClass(BookEntity, request);

    if (images.length > 0) {
      images.forEach(async (item) => {
        await ImageRepository.update(
          {
            id: item.id,
          },
          {
            url: item.url,
          }
        );
      });
    }

    return BookRepository.update(
      {
        id,
      },
      book
    );
  }

  async detail(id: string) {
    const result = await BookRepository.findById(id);
    if (!result.entities[0]) throw ApiError(StatusCodes.NOT_FOUND, `product width id ${id} not found`);
    result.entities.forEach((item, index) => {
      item["rating_number"] = result.raw[index]["rating_number"] || 0;
    });

    return result.entities[0];
  }

  async delete(id: string) {
    const result = await BookRepository.delete({ id });
    return result;
  }
}
