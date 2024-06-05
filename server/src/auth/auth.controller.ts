import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterProfessorDto } from 'src/auth/dto/register-professor.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { SignInCredentials } from './dto/signin-credentials.dto';
import { SignUpCredentials } from './dto/signup-credentials.dto';
import { User, UserRole } from './entities/user.entity';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    signUp(@Body() signUpCretdentials: SignUpCredentials): Promise<string> {
        console.log(signUpCretdentials);
        return this.authService.signUp(signUpCretdentials);
    }

    @Post('/signin')
    signIn(
        @Body() signInCredentials: SignInCredentials,
    ): Promise<{ accessToken: string }> {
        return this.authService.signIn(signInCredentials);
    }

    /**
     * Registers a professor with a career.
     * @param coordinator - The coordinator who is registering the professor.
     *                      We use the GetUser decorator to get the user object from the request.
     *                     We also use the RolesGuard to check if the user has the required roles.
     *                      We Set the base AuthGuard and the RolesGuard.
     * @param registerProfessorDto - The data to register the professor.
     * @returns - The registered professor.
     */
    @UseGuards(AuthGuard(), RolesGuard)
    @Roles(UserRole.COORD)
    @Post('/register/professor')
    registerProfessor(
        @GetUser() coordinator: User,
        @Body() registerProfessorDto: RegisterProfessorDto,
    ): Promise<User> {
        return this.authService.registerUpdateProfessor(
            registerProfessorDto,
            coordinator,
        );
    }

    @UseGuards(AuthGuard(), RolesGuard)
    @Roles(UserRole.COORD)
    @Put('/professor/:id')
    updateProfessor(
        @GetUser() coordinator: User,
        @Body() registerProfessorDto: RegisterProfessorDto,
        @Param('id') professorId: string,
    ): Promise<User> {
        return this.authService.registerUpdateProfessor(
            registerProfessorDto,
            coordinator,
            professorId,
        );
    }

    @UseGuards(AuthGuard(), RolesGuard)
    @Roles(UserRole.COORD)
    @Get('/professors')
    getProfessors(@GetUser() user: User): Promise<User[]> {
        return this.authService.getProfessorsByCareer(user);
    }
}
