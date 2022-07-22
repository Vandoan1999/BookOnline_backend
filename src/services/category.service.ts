import { BookEntity } from "@entity/book.entity";
import { Role } from "@enums/role.enum";
import { CreateCategoryRequest } from "@models/category/create-category.request";
import { UserInfo } from "@models/user/UserInfo";
import { BookRepository } from "@repos/book.repository";
import { CategoryRepository } from "@repos/category.repository";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../ultis/apiError";
import { Service } from "typedi";
import { UpdateCategoryRequest } from "@models/category/update-category.request";
import { Sort } from "@models/sort";

require("dotenv").config();
@Service()
export class CategoryService {
  constructor() {}

  getList() {
    return CategoryRepository.findAndCount({
      order: { name: Sort.ASC },
    });
  }

  async create(request: CreateCategoryRequest, user: UserInfo) {
    if (user.role === Role.USER) {
      throw ApiError(StatusCodes.FORBIDDEN);
    }
    const category = CategoryRepository.create(request);
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

  async update(request: UpdateCategoryRequest, user: UserInfo) {
    if (user.role === Role.USER) {
      throw ApiError(StatusCodes.FORBIDDEN);
    }
    const category = await CategoryRepository.findOne({
      where: { id: request.id },
    });

    if (!category) {
      throw ApiError(StatusCodes.NOT_FOUND);
    }
    category.name = request.name;
    category.image = request.image;

    return CategoryRepository.update({ id: request.id }, category);
  }

  async delete(id: string, user: UserInfo) {
    if (user.role === Role.USER) {
      throw ApiError(StatusCodes.FORBIDDEN);
    }
    const category = await CategoryRepository.findOneOrFail({
      where: { id },
    });

    return CategoryRepository.delete({ id: category.id });
  }
}
