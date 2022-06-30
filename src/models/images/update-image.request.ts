import { IsNotEmpty } from "class-validator";
export class UpdateImageRequest {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  url: string;
}
