import { Role } from "@enums/role.enum";
import { CreateCategoryRequest } from "@models/category/create-category.request";
import { UserInfo } from "@models/user/UserInfo";
import { CategoryRepository } from "@repos/category.repository";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../ultis/apiError";
import { Service } from "typedi";
import { UpdateCategoryRequest } from "@models/category/update-category.request";
import { ImageService } from "./image.service";

require("dotenv").config();
@Service()
export class CategoryService {
  constructor(private imageService: ImageService) {}

  async getList() {
    const [category, total] = await CategoryRepository.findAndCount();
    return {
      category: await this.imageService.getImageByObject(category),
      total,
    };
  }

  async create(request: CreateCategoryRequest, user: UserInfo) {
    if (user.role === Role.USER) {
      throw ApiError(StatusCodes.FORBIDDEN);
    }
    const category = CategoryRepository.create(request);
    return CategoryRepository.save(category);
  }

  async detail(id: string) {
    const category = await CategoryRepository.findOneOrFail({
      where: { id },
      relations: {
        books: true,
      },
    });
    return category;
  }

  async update(request: UpdateCategoryRequest, user: UserInfo) {
    if (user.role === Role.USER) {
      throw ApiError(StatusCodes.FORBIDDEN);
    }
    const category = await CategoryRepository.findOneOrFail({
      where: { id: request.id },
    });
    category.name = request.name;
    await CategoryRepository.save(category);
  }

  async delete(id: string, user: UserInfo) {
    if (user.role === Role.USER) {
      throw ApiError(StatusCodes.FORBIDDEN);
    }
    const category = await CategoryRepository.findOneOrFail({
      where: { id },
    });

    await CategoryRepository.delete({ id: category.id });
  }
}
