import { Transform, Type } from "class-transformer";
import { Allow, IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { Image } from "@models/user/update-user.request";
export class CreateBookRequest {
  @IsNotEmpty()
  name: string;

  @Allow()
  discounted: number;

  @Allow()
  price_import: number;

  @Allow()
  price_export: number;

  @Allow()
  views: number;

  @Allow()
  quantity: number;

  @Allow()
  published_date: Date;

  @Allow()
  publisher: string;

  @Allow()
  author: string;

  @Allow()
  description: string;

  @IsOptional()
  @IsArray()
  categories_id: string[];

  @IsOptional()
  @IsArray()
  @Type(() => Image)
  images: any;

  @IsOptional()
  @Type(() => Image)
  avartar: any;
}
