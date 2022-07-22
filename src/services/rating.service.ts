import { CreateRatingRequest } from "@models/rating/create-rating.request";
import { UpdateRatingRequest } from "@models/rating/update-rating.request";
import { BookRepository } from "@repos/book.repository";
import { UserRepository } from "@repos/user.repository";
import { ApiError } from "../ultis/apiError";

import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import { RatingRepository } from "@repos/rating.repository";

@Service()
export class RatingService {
  constructor() {}

  async createOrUpdate(request: CreateRatingRequest) {
    const user = await UserRepository.findOne({
      where: { id: request.user_id },
    });
    const book = await BookRepository.findOne({
      where: { id: request.book_id },
    });

    if (!user) {
      throw ApiError(StatusCodes.NOT_FOUND, "user not found!");
    }

    if (!book) {
      throw ApiError(StatusCodes.NOT_FOUND, "book not found!");
    }

    const rating = await RatingRepository.findOne({
      where: { book_id: book.id, user_id: user.id },
    });
    if (!rating) {
      const ratingToBeSaved = RatingRepository.create();
      ratingToBeSaved.user = user;
      ratingToBeSaved.book = book;
      ratingToBeSaved.content = request.content;
      ratingToBeSaved.rating_number = request.rating_number;
      await RatingRepository.save(ratingToBeSaved);
      return "create rating success!";
    } else {
      rating.content = request.content;
      rating.rating_number = request.rating_number;
      await RatingRepository.save(rating);
      return "update rating success!";
    }
  }

  async delete(book_id: string, user_id: string) {
    const rating = await RatingRepository.findOneOrFail({
      where: { book_id: book_id, user_id: user_id },
    });
    await RatingRepository.delete({
      book_id: rating.book_id,
      user_id: rating.user_id,
    });
  }
}
