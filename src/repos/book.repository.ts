import { config } from "@config/app";
import { AppDataSource } from "@config/db";
import { BookEntity as BookEntity } from "@entity/book.entity";
import { Order } from "@enums/order";
import { ListBookRequest } from "@models/book/list-book.request";

export const BookRepository = AppDataSource.getRepository(BookEntity).extend({
  getList(request: ListBookRequest) {
    const take = request.limit || config.page.default_limit;
    const page = request.page || 1;
    const skip = (page - 1) * take;

    const query = this.createQueryBuilder("book");
    if (request.fillter) {
      const fillter = JSON.parse(request.fillter);
      fillter.forEach((item) => {
        switch (item.column) {
          case "name":
            query.andWhere("LOWER(book.name) LIKE LOWER(:name)", {
              name: `%${item.text}%`,
            });
            break;

          case "author":
            query.andWhere("book.author LIKE :author", {
              name: `%${item.text}%`,
            });
            break;

          case "price_export":
            if (item.text === Order.ASC || item.text === Order.DESC)
              query.orderBy("book.price_export", item.text);
            break;

          case "sold":
            if (item.text === Order.ASC || item.text === Order.DESC)
              query.orderBy("book.sold", item.text);
            break;

          case "views":
            if (item.text === Order.ASC || item.text === Order.DESC)
              query.orderBy("book.views", item.text);
            break;

          case "created_at":
            if (item.text === Order.ASC || item.text === Order.DESC)
              query.orderBy("book.created_at", item.text);
            break;
        }
      });
    }

    return query.take(take).skip(skip).getManyAndCount();
  },

  getDetail(id: string) {
    const query = this.createQueryBuilder("b");
    query.select([
      "b.id AS id",
      "b.name AS name",
      "b.discounted AS discounted",
      "b.price_import AS price_import",
      "b.price_export AS price_export",
      "b.sold AS sold",
      "b.views AS views",
      "b.published_date AS published_date",
      "b.quantity AS quantity",
      "b.publisher AS publisher",
      "b.author AS author",
      "b.description AS description",
      "b.created_at AS created_at",
      `CASE WHEN count("r") = 0 THEN '[]' 
      ELSE JSON_AGG(JSONB_BUILD_OBJECT('book_id', r.book_id,
       'user_id', r.user_id ,
       'content',r.content ,
      'rating_number', r.rating_number
       )) END AS "commments"`,
    ]);
    query.innerJoin("rating", "r", "b.id = r.book_id");
    query.where("b.id = :id", { id });
    query.groupBy("b.id");
    return query.getRawOne();
  },
});
