import { Allow, IsArray, IsNotEmpty, IsOptional } from "class-validator";
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
}
