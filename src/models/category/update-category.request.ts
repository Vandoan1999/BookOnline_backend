import { IsNotEmpty, IsOptional } from "class-validator";
export class UpdateCategoryRequest {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  image: string;
}
