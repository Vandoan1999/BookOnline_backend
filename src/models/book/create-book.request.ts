import { Allow, IsArray, IsOptional } from "class-validator";
export class CreateBookRequest {
  @Allow()
  name: string;

  @Allow()
  avatar: string;

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
  images_url: string[];

  @IsOptional()
  category_id: string[];
}
