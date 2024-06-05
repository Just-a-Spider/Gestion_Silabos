import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterProfessorDto {
    @IsString()
    @IsNotEmpty()
    prof_name: string;

    @IsString()
    @IsNotEmpty()
    prof_lastname: string;

    @IsString()
    prof_email: string;

    @IsString()
    @IsNotEmpty()
    prof_code: string;

    @IsString()
    @IsNotEmpty()
    prof_dni: string;

    @IsString()
    prof_phone: string;
}
