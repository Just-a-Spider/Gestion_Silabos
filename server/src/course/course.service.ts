import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlinkSync } from 'fs';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UploadSilaboDto } from './dto/upload-silabo.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
    private logger = new Logger('CourseService', { timestamp: true });

    /**
     * The constructor injects the Course and User repositories.
     * @param courseRepository - The course repository to interact with the Course entity.
     * @param userRepository - The user repository to interact with the User entity.
     */
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    // Course Related Methods
    async createModifyCourse(
        createCourseDto: CreateCourseDto,
        user: User,
        courseId?: string,
    ): Promise<Course> {
        try {
            const { name, semester, cycle } = createCourseDto;
            const professor = await this.userRepository.findOne({
                where: { id: createCourseDto.professor },
            });
            const career = user.career;

            if (courseId) {
                const course = await this.courseRepository.findOne({
                    where: { id: courseId },
                });

                course.name = name;
                course.semester = semester;
                course.cycle = cycle;
                course.career = career;
                course.professor = professor;

                return this.courseRepository.save(course);
            }

            const course = {
                name,
                semester,
                cycle,
                career,
                professor,
            };
            return this.courseRepository.save(course);
        } catch (error) {
            this.logger.error(`Failed to create or modify course`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async getCourses(user: User): Promise<Course[]> {
        let findOptions = {};

        if (user.role !== 'professor') {
            findOptions = { where: { career: user.career } };
        } else {
            findOptions = { where: { professor: { id: user.id } } };
        }

        try {
            const courses = await this.courseRepository.find(findOptions);
            return courses;
        } catch (error) {
            this.logger.error(
                `Failed to retrieve courses for ${user.role} "${user.code}".`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }
    }

    async uploadSilaboPdf(uploadSilaboDto: UploadSilaboDto): Promise<Course> {
        const { courseId, pdfPath } = uploadSilaboDto;

        try {
            const course = await this.courseRepository.findOne({
                where: { id: courseId },
            });
            // Delete the current pdf if it exists
            if (course.silabo_pdf != null) {
                try {
                    const path = `./media/silabos/${course.silabo_pdf}`;
                    unlinkSync(path);
                } catch (error) {
                    this.logger.error(
                        `Failed to delete silabo pdf for course "${courseId}".\nPerhaps the file does not exist.`,
                        error.stack,
                    );
                }
            }
            course.silabo_pdf = pdfPath;
            return this.courseRepository.save(course);
        } catch (error) {
            this.logger.error(
                `Failed to upload silabo pdf for course "${courseId}".`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }
    }
}
