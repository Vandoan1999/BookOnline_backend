import { CreateImageRequest } from "@models/images/create-image.request";
import { CreateRatingRequest } from "@models/rating/create-rating.request";
import { ImageRepository } from "@repos/image.repository";
import { RatingRepository } from "@repos/rating.repository";

import { Service } from "typedi";

@Service()
export class RatingService {
  constructor() { }

  create(request: CreateImageRequest) {
    const book = Object.assign(ImageRepository.create(), request);
    return RatingRepository.save(book);
  }

}
