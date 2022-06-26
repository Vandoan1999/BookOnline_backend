import { CreateRatingRequest } from "@models/rating/create-rating.request";
import { RatingRepository } from "@repos/rating.repository";

import { Service } from "typedi";

@Service()
export class RatingService {
  constructor() { }

  create(request: CreateRatingRequest) {
    const book = Object.assign(RatingRepository.create(), request);
    return RatingRepository.save(book);
  }


}
