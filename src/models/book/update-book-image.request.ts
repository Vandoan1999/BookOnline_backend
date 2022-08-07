import {
  Allow,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from "class-validator";
export enum actionType {
  ADD = "add",
  DELETE = "delete",
}
export class UpdateBookImageRequest {
  @IsNotEmpty()
  @IsEnum(actionType)
  action: actionType;

  @IsOptional()
  book_id: string;

  @IsOptional()
  images_data: any[];

  @IsOptional()
  images_id: string[];

  @IsOptional()
  order: number[];
}
