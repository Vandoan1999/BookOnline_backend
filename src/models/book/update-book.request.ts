import { ImageEntity } from "@entity/image.entity";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
export class UpdateBookRequest {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsNumber()
  discounted?: number;

  @IsOptional()
  @IsNumber()
  price_import?: number;

  @IsOptional()
  @IsNumber()
  price_export?: number;

  @IsOptional()
  @IsNumber()
  sold?: number;

  @IsOptional()
  @IsNumber()
  views?: number;

  @IsOptional()
  @IsString()
  published_date?: Date;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  image_delete?: string[];

  @IsOptional()
  @IsArray()
  image_update?: ImageEntity[];

  @IsOptional()
  supplier_update?: string;

  @IsOptional()
  @IsArray()
  category_delete?: string[];

  @IsOptional()
  @IsArray()
  category_update?: string[];
}
