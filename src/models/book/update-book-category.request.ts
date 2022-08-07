import {
  Allow,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from "class-validator";
export enum actionType {
  ADD = "add",
  DELETE = "delete",
}
export class UpdateBookCategoryRequest {
  @IsNotEmpty()
  @IsEnum(actionType)
  action: actionType;

  @IsNotEmpty()
  book_id: string;

  @IsArray()
  categories: string[];
}
