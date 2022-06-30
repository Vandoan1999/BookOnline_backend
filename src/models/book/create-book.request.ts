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
  sold: number;

  @Allow()
  views: number;

  @Allow()
  published_date: Date;

  @Allow()
  quantity: number;

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
  supplier_id: string;

  @IsOptional()
  category_id: string[];
}
