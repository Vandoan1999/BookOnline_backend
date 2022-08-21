import { CreateRatingRequest } from "@models/rating/create-rating.request";
import { UpdateRatingRequest } from "@models/rating/update-rating.request";
import { BookRepository } from "@repos/book.repository";
import { UserRepository } from "@repos/user.repository";
import { ApiError } from "../ultis/apiError";

import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import { RatingRepository } from "@repos/rating.repository";
import { GetListRatingRequest } from "@models/rating/get-list-rating.request";
import { ImageService } from "./image.service";

@Service()
export class RatingService {
  constructor(private imageService: ImageService) {}

  async getListRating(request: GetListRatingRequest) {
    const [rating, total] = await RatingRepository.getListRating(request);
    for (const r of rating) {
      if (r.user.avartar) {
        r.user.avartar = JSON.parse(r.user.avartar);
      }
    }

    return {
      rating,
      total,
    };
  }

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

      if (book.total_rating === 0) {
        book.rating_number = request.rating_number;
        book.total_rating += 1;
      } else {
        const newRatingNumber =
          (book.rating_number * book.total_rating + request.rating_number) /
          (book.total_rating + 1);
        book.rating_number = newRatingNumber;
        book.total_rating += 1;
      }
      await BookRepository.save(book);
      return "Create a successful rating";
    } else {
      let ratingNumberChanged = rating.rating_number - request.rating_number;
      rating.content = request.content;
      rating.rating_number = request.rating_number;

      if (ratingNumberChanged > 0) {
        const newRatingNumber =
          (book.rating_number * book.total_rating - ratingNumberChanged) /
          book.total_rating;
        book.rating_number = newRatingNumber;
        await RatingRepository.save(rating);
        await BookRepository.save(book);

        return "Update a successful rating";
      }

      if (ratingNumberChanged < 0) {
        const newRatingNumber =
          (book.rating_number * book.total_rating - ratingNumberChanged) /
          book.total_rating;
        book.rating_number = newRatingNumber;
        await RatingRepository.save(rating);
        await BookRepository.save(book);
        return "Update a successful rating";
      }
      return "has no change";
    }
  }

  async delete(book_id: string, user_id: string) {
    const book = await BookRepository.findOneOrFail({
      where: { id: book_id },
    });
    const rating = await RatingRepository.findOneOrFail({
      where: { book_id: book_id, user_id: user_id },
    });
    const newRatingNumber =
      (book.rating_number * book.total_rating - rating.rating_number) /
      (book.total_rating - 1);
    book.rating_number = newRatingNumber;
    book.total_rating -= 1;
    await RatingRepository.delete({
      book_id: rating.book_id,
      user_id: rating.user_id,
    });
  }
}
