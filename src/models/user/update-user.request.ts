import { Gender } from "@enums/gender.enum";
import { Allow, IsEnum, IsOptional } from "class-validator";

export class UpdateUserRequest{

    @Allow()
    username: string;
  
    @Allow()
    email: string;
  
    @Allow()
    password: string;
  
    @IsOptional()
    @IsEnum(Gender)
    sex: Gender;
  
    @Allow()
    image: string;
  
    @IsOptional()
    address: string;
  
    @IsOptional()
    phone: string;
  
    @IsOptional()
    bank: string;
}