import { Allow, IsNotEmpty, IsNumber, Max, Min } from "class-validator";
export class CreateRatingRequest {
    @IsNotEmpty()
    user_id: string;

    @IsNotEmpty()
    book_id: string;

    @IsNumber()
    @Max(5)
    @Min(0)
    rating_number: number;

    @Allow()
    content: string
}
