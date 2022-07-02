import { AppDataSource } from "@config/db";
import { ImageEntity } from "@entity/image.entity";

export const ImageRepository = AppDataSource.getRepository(ImageEntity).extend({});
