import { AppDataSource } from "@config/db";
import { BooksEntity as BookEntity } from "@entity/book.entity";

export const BookRepository = AppDataSource.getRepository(BookEntity).extend({});
