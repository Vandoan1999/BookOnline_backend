import { config } from "@config/app";
import { AppDataSource } from "@config/db";
import { BooksEntity as BookEntity } from "@entity/book.entity";
import { ListBookRequest } from "@models/book/list-book.request";
import { OrderByEnum } from "@models/book/orderBy.enum";

export const BookRepository = AppDataSource.getRepository(BookEntity).extend({
  getList(request: ListBookRequest) {
    const take = request.limit || config.page.default_limit
    const page = request.page || 1
    const skip = (page - 1) * take

    const query = this.createQueryBuilder("book")
    query.leftJoinAndSelect("book.images", "image")
    query.addSelect(`(select avg(r.rating_number)from rating r  where r."bookIdId" = book.id)`, "rating_number")
    if (request.search) {
      query.where("book.name LIKE :name", { name: `%${request.search}%` });
    }
    if (request.author) {
      query.where("book.author LIKE :author", { author: `%${request.author}%` });
    }

    if (request.orderBy === OrderByEnum.price) {
      query.orderBy("book.price_export", request.order);
    } else if (request.orderBy === OrderByEnum.sold) {
      query.orderBy("book.sold", request.order);
    } else if (request.orderBy === OrderByEnum.views) {
      query.orderBy("book.views", request.order);
    }

    return query
      .take(take)
      .skip(skip)
      .getRawAndEntities()

  },

  findById(id: string) {
    return this.createQueryBuilder("book")
      .leftJoinAndSelect("book.images", "images")
      .addSelect(`(select avg(r.rating_number)from rating r  where r."bookIdId" = book.id)`, "rating_number")
      .where("book.id = :id", { id })
      .getRawAndEntities()
  }
});
