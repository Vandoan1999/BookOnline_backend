import { deleteObject, GetObjectURl, uploadFile } from "@common/baseAWS";
import { config } from "@config/app";
import { UpdateImageRequest } from "@models/images/update-image.request";
import { ImageRepository } from "@repos/image.repository";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../ultis/apiError";
import { Service } from "typedi";
import { In } from "typeorm";
import { CreateImageRequest } from "@models/images/create-image.request";
import { ImageType } from "@enums/image-type.enum";
import { ImageEntity } from "@entity/image.entity";
import logger from "jet-logger";
import { ImageTableName } from "@enums/image-table-name.enum";
import { BookRepository } from "@repos/book.repository";
import { CategoryRepository } from "@repos/category.repository";
import { UserRepository } from "@repos/user.repository";

@Service()
export class ImageService {
  constructor() {}

  async update(request: UpdateImageRequest) {
    const imageToBeSaved = await ImageRepository.findOneByOrFail({
      id: request.id,
    });
    const oldImage = imageToBeSaved.url;
    const tableName = oldImage.split("-")[0];
    imageToBeSaved.url = this.generateNameImage(
      tableName,
      request.image["originalname"]
    );
    logger.info(`Start updating images to db!`);
    await ImageRepository.save(imageToBeSaved);
    logger.info(`Updated the photo!`);

    logger.info(`Start deleting old photos from s3`);
    await deleteObject(config.s3Bucket, config.s3BucketForder + oldImage);
    logger.info(`Deleted deleted old photos from s3`);
    logger.info(`Start uploading new photos to s3`);
    await uploadFile(
      request.image.buffer,
      config.s3Bucket,
      request.image.mimetype,
      config.s3BucketForder + imageToBeSaved.url
    );
    logger.info(`uploaded a new photo to s3`);
  }

  async create(request: CreateImageRequest) {
    const imageToBeSave: ImageEntity[] = [];
    const imageToBeUploadS3: any[] = [];
    let item;
    let totalImage;
    let totalAvartar;
    switch (request.tableName) {
      case ImageTableName.books:
        item = await BookRepository.findOneByOrFail({ id: request.item_id });
        totalImage = await ImageRepository.countBy({
          item_id: request.item_id,
          type: ImageType.image,
        });
        totalAvartar = await ImageRepository.countBy({
          item_id: request.item_id,
          type: ImageType.avartar,
        });
        if (request.type === ImageType.avartar && totalAvartar >= 1) {
          throw ApiError(
            StatusCodes.BAD_REQUEST,
            `book id ${request.item_id} has more than 1 avartar`
          );
        }
        if (request.type === ImageType.image && totalImage >= 5) {
          throw ApiError(
            StatusCodes.BAD_REQUEST,
            `book id ${request.item_id} has more than 5 image`
          );
        }
        break;

      case ImageTableName.categories:
        item = await CategoryRepository.findOneByOrFail({
          id: request.item_id,
        });
        totalImage = await ImageRepository.countBy({
          item_id: request.item_id,
          type: ImageType.image,
        });
        if (request.type !== ImageType.image) {
          throw ApiError(
            StatusCodes.BAD_REQUEST,
            `category id ${request.item_id} only update image`
          );
        }
        if (totalImage >= 1) {
          throw ApiError(
            StatusCodes.BAD_REQUEST,
            `category id ${request.item_id} has more than 1 image`
          );
        }
        break;

      case ImageTableName.users:
        item = await UserRepository.findOneByOrFail({ id: request.item_id });
        totalImage = await ImageRepository.countBy({
          item_id: request.item_id,
          type: ImageType.image,
        });
        if (request.type !== ImageType.image) {
          throw ApiError(
            StatusCodes.BAD_REQUEST,
            `user id ${request.item_id} only update image`
          );
        }
        if (totalImage >= 1) {
          throw ApiError(
            StatusCodes.BAD_REQUEST,
            `user id ${request.item_id} has more than 1 image`
          );
        }
        break;

      default:
        item = null;
        break;
    }

    if (!item) {
      throw ApiError(
        StatusCodes.BAD_REQUEST,
        `item id ${request.item_id} invalid`
      );
    }

    if (request.type === ImageType.image) {
      for (const image of request.images) {
        const newImageName = this.generateNameImage(
          request.tableName,
          image.originalname
        );
        const img = new ImageEntity();
        img.item_id = request.item_id;
        img.url = newImageName;
        img.type = request.type;
        imageToBeSave.push(img);

        imageToBeUploadS3.push(
          uploadFile(
            image.buffer,
            config.s3Bucket,
            image.mimetype,
            config.s3BucketForder + newImageName
          )
        );
      }

      const res = await ImageRepository.save(imageToBeSave);
      for (const img of res) {
        logger.info(`create images ! ${JSON.stringify(img)} !`);
      }
      await Promise.all(imageToBeUploadS3);
      logger.info(`uploaded images to s3 done! `);
    }

    if (request.type === ImageType.avartar) {
      const imageToBeSave = request.images[0];
      const newImageName = this.generateNameImage(
        request.tableName,
        imageToBeSave.originalname
      );
      const img = new ImageEntity();
      img.item_id = request.item_id;
      img.url = newImageName;
      img.type = request.type;
      const res = await ImageRepository.save(img);
      logger.info(`created images ! ${JSON.stringify(res)} !`);
      await uploadFile(
        imageToBeSave.buffer,
        config.s3Bucket,
        imageToBeSave.mimetype,
        config.s3BucketForder + newImageName
      );
      logger.info(`upload images to s3 suucess ! ${JSON.stringify(res)}`);
    }
  }

  async delete(ids: any = null, objectIds: any = null) {
    let arrId;
    let image;
    if (ids) {
      arrId = ids.split(",");
      image = await ImageRepository.find({
        where: { id: In([...arrId]) },
      });
    }
    if (objectIds) {
      arrId = objectIds.split(",");
      image = await ImageRepository.find({
        where: { item_id: In([...arrId]) },
      });
    }

    const invalidImg: any[] = [];
    for (const id of arrId) {
      if (ids) {
        const invalidItem = !image.find((item) => item.id === id);
        if (invalidItem) {
          invalidImg.push(id);
        }
      }
      if (objectIds) {
        const invalidItem = !image.find((item) => item.item_id === id);
        if (invalidItem) {
          invalidImg.push(id);
        }
      }
    }
    if (invalidImg.length > 0) {
      throw ApiError(StatusCodes.BAD_REQUEST, `images invalid`, {
        invalidImg,
      });
    }
    logger.info(`Start deleting photos from the database!`);
    await ImageRepository.delete({ id: In([...arrId]) });
    logger.info(`Deleted photos from database !`);
    const promiseAll: any[] = [];
    for (const { url } of image) {
      promiseAll.push(
        deleteObject(config.s3Bucket, config.s3BucketForder + url)
      );
    }
    logger.info(`Start deleting photos from s3! `);
    await Promise.all(promiseAll);
    logger.info(`Deleted photos from s3! `);
  }

  private generateNameImage(tableName: string, originalname: string) {
    return `${tableName}-${Math.floor(
      Math.random() * 100000
    )}-${originalname.replace("-", "")}`;
  }

  public async getImageByObject(objects: any[]) {
    const ids = objects.map((item) => item.id);
    const images = await ImageRepository.find({
      where: { item_id: In([...ids]) },
    });
    for (const object of objects) {
      const image = images
        .filter((i) => i.item_id === object.id && i.type === ImageType.image)
        .map((i) => {
          return {
            ...i,
            link: GetObjectURl(i.url),
          };
        });
      const avatar = images.find(
        (i) => i.item_id === object.id && i.type === ImageType.avartar
      );

      if (image.length === 0) {
        object["images"] = [];
      } else {
        object["images"] = image;
      }

      if (avatar) {
        object["avartar"] = {
          ...avatar,
          link: GetObjectURl(avatar.url),
        };
      } else {
        object["avartar"] = "";
      }
    }
    return objects;
  }
}
