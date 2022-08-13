"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingRepository = void 0;
const app_1 = require("@config/app");
const db_1 = require("@config/db");
const rating_entity_1 = require("@entity/rating.entity");
const order_1 = require("@enums/order");
exports.RatingRepository = db_1.AppDataSource.getRepository(rating_entity_1.RatingEntity).extend({
    getListRating(request) {
        const take = request.limit || app_1.config.page.default_limit;
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
                        if (item.text === order_1.Order.ASC || item.text === order_1.Order.DESC)
                            query.orderBy("r.created_at", item.text);
                        break;
                    case "rating_number":
                        if (item.text === order_1.Order.ASC || item.text === order_1.Order.DESC)
                            query.orderBy("r.rating_number", item.text);
                        break;
                    case "content":
                        query.andWhere("LOWER(r.content) LIKE LOWER(:content)", { content: item.text });
                        break;
                }
            });
        }
        return query.take(take).skip(skip).getManyAndCount();
    },
});
