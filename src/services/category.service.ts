import { BookEntity } from "@entity/book.entity";
import { Role } from "@enums/role.enum";
import { CreateCategoryRequest } from "@models/category/create-category.request";
import { UserInfo } from "@models/user/UserInfo";
import { BookRepository } from "@repos/book.repository";
import { CategoryRepository } from "@repos/category.repository";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "src/ultis/apiError";
import { Service } from "typedi";

require("dotenv").config();
@Service()
export class CategoryService {
  constructor() {}

  getList() {
    return CategoryRepository.findAndCount();
  }

  async create(request: CreateCategoryRequest, user: UserInfo) {
    if (user.role === Role.USER) {
      throw ApiError(StatusCodes.FORBIDDEN);
    }

    const books: BookEntity[] = [];

    for (const item of request.books) {
      const book = await BookRepository.findOne({ where: { id: item } });
      if (book) books.push(book);
    }
    request.books;
    if (books.length <= 0) {
      throw ApiError(StatusCodes.BAD_REQUEST);
    }
    const category = CategoryRepository.create();
    category.name = request.name;
    category.image = request.image;
    category.books = books;

    return CategoryRepository.save(category);
  }

  async detail(id: string) {
    const category = await CategoryRepository.findOne({
      where: { id },
      relations: {
        books: true,
      },
    });

    if (!category) {
      throw ApiError(StatusCodes.NOT_FOUND);
    }

    return category;
  }
}
