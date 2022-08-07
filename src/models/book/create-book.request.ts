import { Allow, IsArray, IsNotEmpty, IsOptional } from "class-validator";
export class CreateBookRequest {
  @IsNotEmpty()
  name: string;

  @Allow()
  avatar_data: any;

  @Allow()
  discounted: number;

  @Allow()
  price_import: number;

  @Allow()
  price_export: number;

  @Allow()
  views: number;

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
  images_data: any[];

  @IsOptional()
  @IsArray()
  category_id: string[];
}
