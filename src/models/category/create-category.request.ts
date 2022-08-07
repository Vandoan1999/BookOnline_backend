import { IsNotEmpty, IsOptional } from "class-validator";
export class CreateCategoryRequest {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  image: string;

  @IsOptional()
  image_data: any;
}
