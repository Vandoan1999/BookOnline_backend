"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    page: {
        default_limit: 20,
        max_limit: 100,
    },
    TablePostgres: {
        user: "users",
        books: "books",
        ratings: "rating",
        book_images: "book_images",
        categories: "categories",
        suppliers: "suppliers",
    },
};
