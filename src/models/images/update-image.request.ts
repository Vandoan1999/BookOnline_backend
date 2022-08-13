import { IsNotEmpty, IsOptional } from "class-validator";
export class UpdateImageRequest {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  image: any;
}
