"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRepository = void 0;
const app_1 = require("@config/app");
const db_1 = require("@config/db");
const book_entity_1 = require("@entity/book.entity");
const orderBy_enum_1 = require("@models/book/orderBy.enum");
const sort_1 = require("@models/sort");
exports.BookRepository = db_1.AppDataSource.getRepository(book_entity_1.BookEntity).extend({
    getList(request) {
        const take = request.limit || app_1.config.page.default_limit;
        const page = request.page || 1;
        const skip = (page - 1) * take;
        const query = this.createQueryBuilder("book");
        query.leftJoinAndSelect("book.images", "image");
        query.leftJoinAndSelect("book.categories", "categories");
        query.addSelect(`(select avg(r.rating_number)from rating r  where r."book_id" = book.id)`, "rating_number");
        if (request.search) {
            query.where("book.name LIKE :name", { name: `%${request.search}%` });
        }
        if (request.author) {
            query.where("book.author LIKE :author", {
                author: `%${request.author}%`,
            });
        }
        if (request.orderBy === orderBy_enum_1.OrderByEnum.price) {
            query.orderBy("book.price_export", request.order);
        }
        if (request.orderBy === orderBy_enum_1.OrderByEnum.sold) {
            query.orderBy("book.sold", request.order);
        }
        if (request.orderBy === orderBy_enum_1.OrderByEnum.views) {
            query.orderBy("book.views", request.order);
        }
        if (request.orderBy === orderBy_enum_1.OrderByEnum.created_at) {
            query.orderBy("book.created_at", request.order);
        }
        if (request.orderBy === orderBy_enum_1.OrderByEnum.name) {
            query.orderBy("book.name", sort_1.Sort.ASC);
        }
        return query.take(take).skip(skip).getRawAndEntities();
    },
    findById(id) {
        return this.createQueryBuilder("book")
            .leftJoinAndSelect("book.images", "image")
            .leftJoinAndSelect("book.categories", "categories")
            .leftJoinAndSelect("book.ratings", "ratings")
            .leftJoinAndSelect("ratings.user", "user")
            .addSelect(`(select avg(r.rating_number) from rating r  where r."book_id" = book.id)`, "rating_number")
            .where("book.id = :id", { id })
            .getRawAndEntities();
    },
});
