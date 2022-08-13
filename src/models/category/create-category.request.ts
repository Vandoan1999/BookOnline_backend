import { IsNotEmpty, IsOptional } from "class-validator";
export class CreateCategoryRequest {
  @IsNotEmpty()
  name: string;
}
