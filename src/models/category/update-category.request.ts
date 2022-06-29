import { IsNotEmpty, IsOptional } from "class-validator";
export class CreateCategoryRequest {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  image: string;

  @IsOptional()
  books: string[];
}
