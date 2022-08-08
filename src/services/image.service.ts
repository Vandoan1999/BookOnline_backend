import { deleteObject } from "@common/baseAWS";
import { config } from "@config/app";
import { UpdateImageRequest } from "@models/images/update-image.request";
import { ImageRepository } from "@repos/image.repository";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../ultis/apiError";
import { Service } from "typedi";
import { In } from "typeorm";

@Service()
export class ImageService {
  constructor() {}

  async update(request: UpdateImageRequest) {
    await ImageRepository.update(
      {
        id: request.id,
      },
      {
        url: request.url + "/",
      }
    );
  }

  async delete(ids: string) {
    const arrId = ids.split(",");

    const image = await ImageRepository.find({
      where: { id: In([...arrId]) },
    });
    const invalidImg: any[] = [];
    for (const id of arrId) {
      const invalidItem = !image.find((item) => item.id === id);
      if (invalidItem) {
        invalidImg.push(id);
      }
    }
    if (invalidImg.length > 0) {
      throw ApiError(StatusCodes.BAD_REQUEST, `images invalid`, {
        invalidImg,
      });
    }
    await ImageRepository.delete({ id: In([...arrId]) });
    const promiseAll: any[] = [];
    console.log(image);

    for (const { url } of image) {
      promiseAll.push(
        deleteObject(config.s3Bucket, config.s3BucketForder + url)
      );
    }

    await Promise.all(promiseAll);
  }
}
