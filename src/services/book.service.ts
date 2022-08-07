import { CreateBookRequest } from "@models/book/create-book.request";
import { ListBookRequest } from "@models/book/list-book.request";
import { UpdateBookRequest } from "@models/book/update-book.request";
import { BookRepository } from "@repos/book.repository";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../ultis/apiError";
import { Service } from "typedi";
import { ImageRepository } from "@repos/image.repository";
import { CategoryRepository } from "@repos/category.repository";
import { In } from "typeorm";
import { AppDataSource } from "@config/db";
import { deleteObject, GetObjectURl, uploadFile } from "@common/baseAWS";
import { config } from "@config/app";
import {
  actionType,
  UpdateBookCategoryRequest,
} from "@models/book/update-book-category.request";
@Service()
export class BookService {
  constructor() {}
  async create(request: CreateBookRequest) {
    const bookExist = await BookRepository.findOneBy({ name: request.name });
    if (bookExist) {
      throw ApiError(
        StatusCodes.BAD_REQUEST,
        `name: ${request.name} book existed!`
      );
    }
    const book = BookRepository.create(request);

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
    if (request?.avatar_data[0]) {
      const newImageName = Math.random() + request.avatar_data[0].originalname;
      await uploadFile(
        request.avatar_data[0].buffer,
        config.s3Bucket,
        request.avatar_data[0].mimetype,
        config.s3BucketForder + newImageName
      );
      book.avatar = newImageName;
    }

    const bookSaved = await BookRepository.save(book);
    if (bookSaved && request.images_data && request.images_data.length > 0) {
      for (let i = 0; i < request.images_data.length; i++) {
        const newImageName =
          Math.random() + request.images_data[i].originalname;
        await Promise.all([
          uploadFile(
            request.images_data[i].buffer,
            config.s3Bucket,
            request.images_data[i].mimetype,
            config.s3BucketForder + newImageName
          ),
          ImageRepository.insert({
            url: newImageName,
            order: i,
            book_id: bookSaved,
          }),
        ]);
      }
    }
  }

  async getList(request: ListBookRequest) {
    const result = await BookRepository.getList(request);
    result.entities.forEach((item) => {
      const book_raw = result.raw.find((raw) => raw.book_id == item.id);

      item["rating_number"] = book_raw ? book_raw.rating_number : 0;
      if (item.avatar) {
        item.avatar = GetObjectURl(item.avatar);
      }
      if (item.images && item.images.length > 0) {
        item.images.forEach((img) => {
          img.url = GetObjectURl(img.url);
        });
      }
    });
    const total = await BookRepository.count();
    return {
      data: result.entities,
      total,
    };
  }

  async updateCategory(request: UpdateBookCategoryRequest) {
    const book = await BookRepository.findOneOrFail({
      where: {
        id: request.book_id,
      },
      relations: { categories: true },
    });

    const categories = await CategoryRepository.find({
      where: { id: In([...request.categories]) },
    });
    const invalidCategory: any[] = [];
    request.categories.forEach((id) => {
      const category = !categories.find((e) => e.id === id);
      if (category) {
        invalidCategory.push(id);
      }
    });
    if (invalidCategory.length > 0) {
      throw ApiError(StatusCodes.NOT_FOUND, `category id invalid`, {
        invalidCategory,
      });
    }
    if (request.action === actionType.ADD) {
      book.categories.push(...categories);
      return BookRepository.save(book);
    }

    if (request.action === actionType.DELETE) {
      categories.forEach((e) => {
        book.categories = book.categories.filter((item) => item.id !== e.id);
      });
      return BookRepository.save(book);
    }
  }

  async update(request: UpdateBookRequest) {
    const book = await BookRepository.findOneOrFail({
      where: { id: request.id },
      relations: { images: true, categories: true },
    });
    for (const key in book) {
      if (request.hasOwnProperty(key)) {
        book[key] = request[key];
      }
    }
    let newAvartarName = "";
    let oldAvartarName = "";
    if (request.avatar_data[0]) {
      newAvartarName = Math.random() + request.avatar_data[0].originalname;
      oldAvartarName = book.avatar;
      book.avatar = newAvartarName;
    }

    if (request.images_data) {
      console.log(book.images.length);
      const limitImg = request.images_data.length + book.images.length;
      if (limitImg > 5) {
        throw ApiError(
          StatusCodes.BAD_REQUEST,
          `Mỗi quấn sách chỉ có 5 ảnh, hãy xóa bớt để thêm vào, Còn trống ${
            5 - book.images.length
          }`
        );
      }
      for (const item of request.images_data) {
        const imageTobeSaved = ImageRepository.create();
        const newImageName = Math.random() + item.originalname;
        await uploadFile(
          item.buffer,
          config.s3Bucket,
          item.mimetype,
          config.s3BucketForder + newImageName
        );
        imageTobeSaved.url = newImageName;
        imageTobeSaved.book_id = book;
        imageTobeSaved.order = 1;
        const image = await ImageRepository.save(imageTobeSaved);
        book.images.push(image);
      }
    }
    await BookRepository.save(book);
    if (newAvartarName) {
      await Promise.all([
        oldAvartarName
          ? deleteObject(
              config.s3Bucket,
              config.s3BucketForder + oldAvartarName
            )
          : "",
        uploadFile(
          request.avatar_data[0].buffer,
          config.s3Bucket,
          request.avatar_data[0].mimetype,
          config.s3BucketForder + newAvartarName
        ),
      ]);
    }
  }

  async detail(id: string) {
    const result = await BookRepository.findById(id);
    if (!result.entities[0])
      throw ApiError(StatusCodes.NOT_FOUND, `book width id ${id} not found`);
    result.entities.forEach((item, index) => {
      item["rating_number"] = result.raw[index]["rating_number"] || 0;
      if (item.avatar) {
        item.avatar = GetObjectURl(item.avatar);
      }
      if (item.images && item.images.length > 0) {
        item.images.forEach((img) => {
          img.url = GetObjectURl(img.url);
        });
      }
    });

    return result.entities[0];
  }

  async delete(id: string) {
    const book = await BookRepository.findOneOrFail({ where: { id: id } });
    await BookRepository.delete({ id: book.id });
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
