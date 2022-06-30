import { AppDataSource } from "@config/db";
import { RatingEntity } from "@entity/rating.entity";

export const RatingRepository = AppDataSource.getRepository(RatingEntity).extend({});
