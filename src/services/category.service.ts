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
import { deleteObject, GetObjectURl, uploadFile } from "@common/baseAWS";
import { config } from "@config/app";

require("dotenv").config();
@Service()
export class CategoryService {
  constructor() {}

  async getList() {
    const [category, total] = await CategoryRepository.findAndCount({
      order: { name: Sort.ASC },
    });
    category.forEach((item) => {
      item.image = GetObjectURl(item.image);
    });
    return {
      category,
      total,
    };
  }

  async create(request: CreateCategoryRequest, user: UserInfo) {
    if (user.role === Role.USER) {
      throw ApiError(StatusCodes.FORBIDDEN);
    }

    const category = CategoryRepository.create(request);
    let newNameImg = "";
    if (request.image_data) {
      newNameImg = Math.random() + request.image_data.originalname;
      category.image = newNameImg;
    }
    await CategoryRepository.save(category);
    if (newNameImg) {
      await uploadFile(
        request.image_data.buffer,
        config.s3Bucket,
        request.image_data.mimetype,
        config.s3BucketForder + newNameImg
      );
    }
  }

  async detail(id: string) {
    const category = await CategoryRepository.findOneOrFail({
      where: { id },
      relations: {
        books: true,
      },
    });
    if (category.image) {
      category.image = GetObjectURl(category.image);
    }
    if (category.books.length > 0) {
      category.books.forEach((item) => {
        if (item.avatar) {
          item.avatar = GetObjectURl(item.avatar);
        }
      });
    }
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
    let newNameImg = "";
    let oldNameImg = "";
    if (request.image_data) {
      newNameImg = Math.random() + request.image_data.originalname;
      oldNameImg = category.image;
      category.image = newNameImg;
    }
    await CategoryRepository.save(category);
    if (newNameImg) {
      await Promise.all([
        oldNameImg
          ? deleteObject(config.s3Bucket, config.s3BucketForder + oldNameImg)
          : "",
        uploadFile(
          request.image_data.buffer,
          config.s3Bucket,
          request.image_data.mimetype,
          config.s3BucketForder + newNameImg
        ),
      ]);
    }
  }

  async delete(id: string, user: UserInfo) {
    if (user.role === Role.USER) {
      throw ApiError(StatusCodes.FORBIDDEN);
    }
    const category = await CategoryRepository.findOneOrFail({
      where: { id },
    });

    await CategoryRepository.delete({ id: category.id });
    if (category.image)
      await deleteObject(
        config.s3Bucket,
        config.s3BucketForder + category.image
      );
  }
}
