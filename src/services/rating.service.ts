import { CreateRatingRequest } from "@models/rating/create-rating.request";
import { UpdateRatingRequest } from "@models/rating/update-rating.request";
import { BookRepository } from "@repos/book.repository";
import { RatingRepository } from "@repos/rating.repository";
import { UserRepository } from "@repos/user.repository";

import { Service } from "typedi";

@Service()
export class RatingService {
  constructor() {}

  create(request: CreateRatingRequest) {
    const rating = Object.assign(RatingRepository.create(), request);
    return RatingRepository.save(rating);
  }

  async update(request: UpdateRatingRequest) {
    const book = await BookRepository.findOneOrFail({
      where: { id: request.book_id },
    });
    const user = await UserRepository.findOneOrFail({
      where: { id: request.user_id },
    });
  }
}
