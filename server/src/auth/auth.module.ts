import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        /**
         * We import the ConfigModule to use the ConfigService to retrieve the JWT secret from the environment variables.
         */
        ConfigModule,
        /**
         * We import the PassportModule and set the default strategy to 'jwt'.
         * This will allow us to use the PassportModule and the JwtStrategy in the AuthModule.
         */
        PassportModule.register({ defaultStrategy: 'jwt' }),
        /**
         * We import the JwtModule and set the secret and the expiration time for the token.
         * We use the ConfigService to retrieve the JWT secret from the environment variables.
         */
        JwtModule.registerAsync({
            imports: [ConfigModule], // We import the ConfigModule to use the ConfigService.
            inject: [ConfigService], // We inject the ConfigService to retrieve the JWT secret.
            /**
             * We use the useFactory property to create the options object for the JwtModule.
             * @param consigService - The ConfigService to retrieve the JWT secret.
             * @returns - The options object for the JwtModule.
             */
            useFactory: async (consigService: ConfigService) => ({
                secret: consigService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: '7 days',
                },
            }),
        }),
        /**
         * We import the TypeOrmModule and set the User entity to be used in the AuthModule.
         */
        TypeOrmModule.forFeature([User]),
    ],
    /**
     * Providers are services that are available within the module.
     * We provide the AuthService and the JwtStrategy to be used in the AuthModule.
     */
    providers: [AuthService, JwtStrategy],
    /**
     * Controllers are responsible for handling incoming requests and returning responses to the client.
     * We provide the AuthController to handle the authentication routes.
     */
    controllers: [AuthController],
    /**
     * We export the JwtStrategy and the PassportModule to be used in other modules.
     * @exports - JwtStrategy: responsible for validating JWT tokens and extracting user information from the payload.
     * @exports - PassportModule: allows us to use the PassportModule and the JwtStrategy in other modules.
     */
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
