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
import { In } from "typeorm";
import { AppDataSource } from "@config/db";
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
        const data = await CategoryRepository.findOne({
          where: { id: request.category_id[i] },
        });
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
    result.entities.forEach((item) => {
      const book_raw = result.raw.find((raw) => raw.book_id == item.id);

      item["ratings_number"] = book_raw ? book_raw.rating_number : 0;
    });
    const total = await BookRepository.count();
    return {
      data: result.entities,
      total,
    };
  }

  async update(request: UpdateBookRequest) {
    const book = await BookRepository.findOne({
      where: { id: request.id },
      relations: { images: true, categories: true, supplier: true },
    });
    let imageToBeDeleted;
    let categoryToBeDelete;

    if (!book)
      throw ApiError(
        StatusCodes.BAD_REQUEST,
        `id ${request.id} book not found!`
      );

    if (request.image_delete && request.image_delete.length > 0) {
      for (let i = 0; i < request.image_delete.length; i++) {
        imageToBeDeleted = await ImageRepository.findOne({
          where: { id: request.image_delete[i] },
        });
        if (!imageToBeDeleted)
          throw ApiError(
            StatusCodes.BAD_REQUEST,
            `image to be deleted ${request.image_delete[i]} not found!`
          );
        book.images = book.images.filter((image) => {
          return image.id !== imageToBeDeleted.id;
        });
      }
    }

    if (request.image_update && request.image_update.length > 0) {
      for (let i = 0; i < request.image_update.length; i++) {
        const imageToBeSave = ImageRepository.create(request.image_update[i]);
        imageToBeSave.book_id = book;
        const image = await ImageRepository.save(imageToBeSave);
        book.images.push(image);
      }
    }

    if (request.category_delete) {
      for (let i = 0; i < request.category_delete.length; i++) {
        categoryToBeDelete = await CategoryRepository.findOne({
          where: { id: request.category_delete[i] },
        });

        if (!categoryToBeDelete) {
          throw ApiError(
            StatusCodes.BAD_REQUEST,
            `category to be deleted ${request.category_delete[i]} not found!`
          );
        }
        book.categories = book.categories.filter((category) => {
          return category.id !== categoryToBeDelete.id;
        });
      }
    }

    if (request.category_update) {
      for (let i = 0; i < request.category_update.length; i++) {
        const categoryToBeSaved = await CategoryRepository.findOne({
          where: { id: request.category_update[i] },
        });

        if (categoryToBeSaved) {
          if (
            book.categories.some((cate) => cate.id === categoryToBeSaved.id)
          ) {
            throw ApiError(
              StatusCodes.BAD_REQUEST,
              `category to be update ${categoryToBeSaved.id} exited!`
            );
          }
          book.categories.push(categoryToBeSaved);
        }
      }
    }

    if (request.supplier_update) {
      const supplier = await SupplierRepository.findOne({
        where: { id: request.supplier_update },
      });
      if (supplier) {
        book.supplier = supplier;
      }
    }

    for (const key in book) {
      if (request.hasOwnProperty(key)) {
        book[key] = request[key];
      }
    }
    // return BookRepository.save(book);
    return AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await BookRepository.save(book);
        if (imageToBeDeleted) await ImageRepository.delete(imageToBeDeleted);
        if (imageToBeDeleted) await ImageRepository.delete(imageToBeDeleted);
      }
    );
  }

  async detail(id: string) {
    const result = await BookRepository.findById(id);
    if (!result.entities[0])
      throw ApiError(StatusCodes.NOT_FOUND, `product width id ${id} not found`);
    result.entities.forEach((item, index) => {
      item["rating_number"] = result.raw[index]["rating_number"] || 0;
    });

    return result.entities[0];
  }

  async delete(id: string) {
    const result = await BookRepository.delete({ id });
    return result;
  }

  async delete_multiple(request: any) {
    if (request.query && request.query.ids) {
      let ids: any[] = request.query.ids.split(",");
      const books = await BookRepository.find({ where: { id: In(ids) } });
      if (books.length <= 0) {
        throw ApiError(
          StatusCodes.NOT_FOUND,
          `products width ids ${ids.toString()} not found`
        );
      }
      return BookRepository.remove(books);
    } else {
      throw ApiError(StatusCodes.BAD_REQUEST);
    }
  }
}
