import { deleteObject, uploadFile } from "@common/baseAWS";
import { config } from "@config/app";
import { UpdateImageRequest } from "@models/images/update-image.request";
import { ImageRepository } from "@repos/image.repository";
import { v4 as uuidv4 } from "uuid";
import { Service } from "typedi";
import { In } from "typeorm";
import { CreateImageRequest } from "@models/images/create-image.request";
import { ImageEntity } from "@entity/image.entity";
import logger from "jet-logger";

@Service()
export class ImageService {
  constructor() {}

  async update(request: UpdateImageRequest) {
    const imageToBeSaved = await ImageRepository.findOneByOrFail({
      id: request.id,
    });
    const nameImageOld = imageToBeSaved.link.replace(config.s3Url, "");
    const nameImageNew = this.generateNameImage(`image-${uuidv4()}`);
    imageToBeSaved.link = config.s3Url + nameImageNew;
    await ImageRepository.save(imageToBeSaved);
    await deleteObject(config.s3Bucket, config.s3BucketForder + nameImageOld);
    logger.info(`Deleted deleted old photos from s3`);
    await uploadFile(
      request.image.buffer,
      config.s3Bucket,
      request.image.mimetype,
      config.s3BucketForder + nameImageNew
    );
    logger.info(`uploaded a new photo to s3`);
  }

  async create(request: CreateImageRequest) {
    const promiseAllUploadFileToS3: any[] = [];
    const imageToBeSave: ImageEntity[] = [];
    for (const image of request.images) {
      const imageName = this.generateNameImage(`image-${uuidv4()}`);
      promiseAllUploadFileToS3.push(
        uploadFile(
          image.buffer,
          config.s3Bucket,
          image.mimetype,
          config.s3BucketForder + imageName
        )
      );
      imageToBeSave.push({ link: config.s3Url + imageName });
    }
    logger.info(`Upload images to s3`);
    await Promise.all(promiseAllUploadFileToS3);
    logger.info(`Upload images to done`);

    return ImageRepository.save(imageToBeSave);
  }

  async delete(ids: string[]) {
    const images = await ImageRepository.find({ where: { id: In(ids) } });
    await ImageRepository.remove(images);

    const imageTobeDeleteS3: any[] = [];
    for (const img of images) {
      const nameImageOld = img.link.replace(config.s3Url, "");
      imageTobeDeleteS3.push(
        deleteObject(config.s3Bucket, config.s3BucketForder + nameImageOld)
      );
    }

    await Promise.all(imageTobeDeleteS3);
  }

  private generateNameImage(originalname: string) {
    return `${Math.floor(Math.random() * 100000)}-${originalname}`;
  }
}
