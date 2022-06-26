import { Allow, IsArray, IsNotEmpty, IsOptional } from "class-validator";
export class CreateBookRequest {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
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
  images: string[]
}
