import { ImageTableName } from "@enums/image-table-name.enum";
import { ImageType } from "@enums/image-type.enum";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
export class CreateImageRequest {
  @IsOptional()
  images: any;

  @IsNotEmpty()
  item_id: string;

  @IsNotEmpty()
  @IsEnum(ImageType)
  type: ImageType;

  @IsNotEmpty()
  @IsEnum(ImageTableName)
  tableName: ImageTableName;
}
