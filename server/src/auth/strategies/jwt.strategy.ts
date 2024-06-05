import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../jwt-payload.interface';

/**
 * JwtStrategy class is responsible for validating JWT tokens and extracting user information from the payload.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    /**
     * Creates an instance of JwtStrategy.
     * @param {Repository<User>} userRepository - The user repository.
     * @param {ConfigService} configService - The configuration service.
     * We use the ConfigService to retrieve the JWT secret from the environment variables.
     * Basically, this Service is responsible for reading the .env file and providing the values to the application.
     */
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    /**
     * Validates the JWT payload and returns the corresponding user.
     * @param {JwtPayload} payload - The JWT payload.
     * @returns {Promise<User>} The user object.
     * @throws {UnauthorizedException} If the user is not found.
     */
    async validate(payload: JwtPayload): Promise<User> {
        const { code } = payload;
        const user: User = await this.userRepository.findOne({
            where: { code },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
