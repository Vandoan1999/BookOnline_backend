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
import { SupplierRepository } from "@repos/supplier.repository";
import { CategoryRepository } from "@repos/category.repository";
@Service()
export class BookService {
  constructor() {}
  async create(request: CreateBookRequest) {
    const book = BookRepository.create(request);

    if (request.supplier_id) {
      const supplier = await SupplierRepository.findOne({
        where: {
          id: request.supplier_id,
        },
      });
      if (!supplier) throw ApiError(StatusCodes.BAD_REQUEST);
      book.supplier = supplier;
    }

    if (request.category_id && request.category_id.length > 0) {
      const categories: any[] = [];
      for (let i = 0; i < request.category_id.length; i++) {
        const data = await CategoryRepository.findOne({ where: { id: request.category_id[i] } });
        if (data) {
          categories.push(data);
        }
      }

      book.categories = categories;
    }
    const bookSaved = await BookRepository.save(book);

    if (bookSaved && request.images_url && request.images_url.length > 0) {
      for (let i = 0; i < request.images_url.length; i++) {
        await ImageRepository.insert({
          url: request.images_url[i],
          order: i,
          book_id: bookSaved,
        });
      }
    }
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

  async update(request: UpdateBookRequest) {
    const book = BookRepository.findOne({
      where: { id: request.id },
    });
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
