import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { configSchema } from './config.schema'; // disabling this for the docker-compose
import { CourseModule } from './course/course.module';
import { FilesController } from './app.controller';

@Module({
    imports: [
        // We import the ConfigModule to use the ConfigService to retrieve the environment variables.
        ConfigModule.forRoot({
            envFilePath: [`.env.stage.${process.env.STAGE}`],
            validationSchema: configSchema,
        }),
        // We import the TypeOrmModule and set the database configuration.
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                //const isProduction = configService.get('STAGE') === 'prod';

                return {
                    type: 'postgres', // Type of your database
                    autoLoadEntities: true,
                    synchronize: true,
                    host: configService.get('DB_HOST'), // On prod, copy the values
                    port: configService.get('DB_PORT'), // On prod, copy the values
                    username: configService.get('DB_USERNAME'), // On prod, copy the values
                    password: configService.get('DB_PASSWORD'), // On prod, copy the values
                    database: configService.get('DB_DATABASE'), // On prod, copy the values
                    ssl: false, // We need to set this to true if we are on prod
                    extra: {
                        // We need to set this to true if we are on prod
                        ssl: null,
                    },
                };
            },
        }),
        AuthModule,
        CourseModule,
    ],
    providers: [], // Here we set services directly in the app.module.ts file
    controllers: [FilesController], // Here we set controllers directly in the app.module.ts file
})
export class AppModule {}
