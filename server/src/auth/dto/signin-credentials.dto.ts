import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInCredentials {
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(12)
    code: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}
