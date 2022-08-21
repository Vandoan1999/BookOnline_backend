import { IsOptional } from "class-validator";
export class CreateImageRequest {
  @IsOptional()
  images: any;
}
