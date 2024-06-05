import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    semester: string;

    @IsString()
    @IsNotEmpty()
    cycle: string;

    @IsString()
    @IsNotEmpty()
    professor: string;
}
