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
  images_data?: any[];

  @IsOptional()
  @IsArray()
  avatar_data?: any;
}
