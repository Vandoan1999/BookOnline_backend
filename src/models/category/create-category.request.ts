import { IsNotEmpty, IsOptional } from "class-validator";
export class CreateCategoryRequest {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  image: string;

  @IsOptional()
  books: string[];
}
