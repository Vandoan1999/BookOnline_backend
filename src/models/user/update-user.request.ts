import { Gender } from "@enums/gender.enum";
import { Type } from "class-transformer";
import {
  Allow,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class Image {
  @IsString()
  id: string;

  @IsString()
  link: string;
}
export class UpdateUserRequest {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  email: string;

  @IsOptional()
  fullName: string;

  @IsOptional()
  @IsEnum(Gender)
  sex: Gender;

  @IsOptional()
  address: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  bank: string;

  @IsOptional()
  @Type(() => Image)
  image: Image;
}
