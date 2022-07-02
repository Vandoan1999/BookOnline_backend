import { UpdateImageRequest } from "@models/images/update-image.request";
import { ImageRepository } from "@repos/image.repository";
import { Service } from "typedi";

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

  async delete(id: string) {
    await ImageRepository.delete({ id });
  }
}
