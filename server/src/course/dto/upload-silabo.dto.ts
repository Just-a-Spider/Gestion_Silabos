import { IsString, IsNotEmpty } from 'class-validator';

export class UploadSilaboDto {
    @IsString()
    @IsNotEmpty()
    courseId: string;

    @IsNotEmpty()
    pdfPath: string;
}
