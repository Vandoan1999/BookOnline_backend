import { UserEntity } from "@entity/user.entity";
import { AppDataSource } from "@config/db";
import { CategoryEntity } from "@entity/category.entity";

export const CategoryRepository = AppDataSource.getRepository(CategoryEntity).extend({});
