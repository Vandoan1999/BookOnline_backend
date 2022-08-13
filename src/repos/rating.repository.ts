import { config } from "@config/app";
import { AppDataSource } from "@config/db";
import { RatingEntity } from "@entity/rating.entity";
import { UserEntity } from "@entity/user.entity";
import { Order } from "@enums/order";
import { GetListRatingRequest } from "@models/rating/get-list-rating.request";

export const RatingRepository = AppDataSource.getRepository(
  RatingEntity
).extend({
  getListRating(request: GetListRatingRequest) {
    const take = request.limit || config.page.default_limit;
    const page = request.page || 1;
    const skip = (page - 1) * take;
    const query = this.createQueryBuilder("r");
    query.leftJoinAndSelect("r.user", "u");
    query.where("r.book_id = :book_id", { book_id: request.book_id });
    if (request.fillter) {
      const fillter = JSON.parse(request.fillter);
      fillter.forEach((item) => {
        switch (item.column) {
          case "created_at":
            if (item.text === Order.ASC || item.text === Order.DESC)
              query.orderBy("r.created_at", item.text);
            break;
          case "rating_number":
            if (item.text === Order.ASC || item.text === Order.DESC)
              query.orderBy("r.rating_number", item.text);
            break;
          case "content":
              query.andWhere("LOWER(r.content) LIKE LOWER(:content)", {content:item.text});
            break;  
        }
      });
    }

    return query.take(take).skip(skip).getManyAndCount();
  },
});
