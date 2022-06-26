import { Allow, IsNotEmpty } from "class-validator";
export class CreateImageRequest {
    @IsNotEmpty()
    url: string;

    @Allow()
    order: number;

    @IsNotEmpty()
    book_id: string;
}
