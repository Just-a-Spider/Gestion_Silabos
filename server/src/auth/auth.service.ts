import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterProfessorDto } from 'src/auth/dto/register-professor.dto';
import { Repository } from 'typeorm';
import { SignInCredentials } from './dto/signin-credentials.dto';
import { SignUpCredentials } from './dto/signup-credentials.dto';
import { User, UserRole } from './entities/user.entity';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    // Loggers are used to log information, warnings, errors, and other messages during the application execution.
    private logger = new Logger('AuthService', { timestamp: true });

    constructor(
        /**
         * @param {Repository<User>} userRepository - The user repository.
         * We use the InjectRepository decorator to inject the User repository.
         * This allows us to use the user repository in the AuthService.
         * We acompany this with the TypeOrmModule.forFeature([User]) in the AuthModule.
         */
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService, // The JwtService is used to sign and verify JWT tokens.
    ) {}

    async signUp(signUpCredentials: SignUpCredentials): Promise<string> {
        const { name, lastname, code, dni, email, password } =
            signUpCredentials;

        console.log(signUpCredentials);

        const salt = await bcrypt.genSalt(); // Generate a salt to hash the password.
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            name,
            lastname,
            code,
            dni,
            email,
            password: hashedPassword,
        });

        try {
            await this.userRepository.save(user);
        } catch (error) {
            if (error.code === '23505') {
                // duplicate username or email, POSTGRES 23505, MYSQL ER_DUP_ENTRY
                throw new ConflictException('Username or email already exists');
            } else {
                console.error(error);
                throw new InternalServerErrorException();
            }
        }

        return 'User Created';
    }

    async signIn(
        signInCredentials: SignInCredentials,
    ): Promise<{ accessToken: string }> {
        const { code, password } = signInCredentials;
        const user = await this.userRepository.findOne({ where: { code } });

        if (
            (user.role === UserRole.ADMIN || user.role == UserRole.STUDENT) &&
            password === user.password
        ) {
            const payload: JwtPayload = {
                id: user.id,
                code,
                career: user.career,
                role: user.role,
            };

            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = {
                id: user.id,
                code,
                career: user.career,
                role: user.role,
            };
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException(
                'Please check your login credentials',
            );
        }
    }

    // Professor Related Methods
    async registerUpdateProfessor(
        {
            prof_name,
            prof_lastname,
            prof_code,
            prof_dni,
            prof_email,
            prof_phone,
        }: RegisterProfessorDto,
        coordinator: User,
        profId?: string,
    ): Promise<User> {
        if (profId) {
            const professor = await this.userRepository.findOne({
                where: { id: profId },
            });

            professor.name = prof_name;
            professor.lastname = prof_lastname;
            professor.code = prof_code;
            professor.dni = prof_dni;
            professor.email = prof_email;
            professor.phone = prof_phone;

            try {
                return this.userRepository.save(professor);
            } catch (error) {
                this.logger.error(
                    `Failed to update professor "${professor.code}".`,
                    error.stack,
                );
                throw new InternalServerErrorException();
            }
        } else {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(prof_dni, salt);

            const user = this.userRepository.create({
                name: prof_name,
                lastname: prof_lastname,
                code: prof_code,
                dni: prof_dni,
                password: hashedPassword,
                email: prof_email,
                phone: prof_phone,
                role: UserRole.PROFESSOR,
                career: coordinator.career,
            });

            try {
                await this.userRepository.save(user);
                return user;
            } catch (error) {
                this.logger.error(
                    `Failed to register professor "${user.code}" with career "${user.career}".`,
                    error.stack,
                );
                throw new InternalServerErrorException();
            }
        }
    }

    async getProfessorsByCareer(coord: User): Promise<User[]> {
        const career = coord.career;
        try {
            return this.userRepository.find({
                where: { career, role: UserRole.PROFESSOR },
            });
        } catch (error) {
            this.logger.error(
                `Failed to retrieve professors for career "${career}".`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }
    }
}
