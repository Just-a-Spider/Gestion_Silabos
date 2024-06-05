import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/user.entity';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Course } from './entities/course.entity';

@Module({
    /**
     * We import the TypeOrmModule and set the Course and User entities to be used in the CourseModule.
     * TypeOrmModule.forFeature([Course, User]) - We import the Course and User entities to be used in the CourseModule.
     * We use the forFeature method to define which entities are available in the current module.
     *
     * MulterModule.register() - We import the MulterModule to handle file uploads.
     * We use the register method to configure the MulterModule to all routes in the module.
     *
     * AuthModule - We import the AuthModule to use the authentication features in the CourseModule.
     * These features include the AuthGuard, GetUser decorator, and Roles decorator.
     */
    imports: [
        TypeOrmModule.forFeature([Course, User]),
        MulterModule.register(),
        AuthModule,
    ],
    providers: [CourseService],
    controllers: [CourseController],
})
export class CourseModule {}
