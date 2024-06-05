import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './entities/course.entity';

@Controller('courses')
@UseGuards(AuthGuard(), RolesGuard) // We use the AuthGuard and RolesGuard to protect all the routes.
export class CourseController {
    constructor(private silaboService: CourseService) {}

    @Roles(UserRole.COORD) // We use the Roles decorator to assign the COORD role to the createCourse route.
    @Post()
    async createCourse(
        @GetUser() user: User,
        @Body() createCourseDto: CreateCourseDto,
    ): Promise<Course> {
        return this.silaboService.createModifyCourse(createCourseDto, user);
    }

    @Roles(UserRole.COORD)
    @Put('/:id')
    async modifyCourse(
        @GetUser() user: User,
        @Param('id') courseId: string,
        @Body() createCourseDto: CreateCourseDto,
    ): Promise<Course> {
        return this.silaboService.createModifyCourse(
            createCourseDto,
            user,
            courseId,
        );
    }

    @Roles() // Here we allow all roles to access the getCourses route.
    @Get()
    async getCourses(@GetUser() user: User): Promise<Course[]> {
        return this.silaboService.getCourses(user);
    }

    /**
     * Uploads a PDF file to the server.
     * We use the UseInterceptors decorator to upload the file.
     * We use the FileInterceptor to handle the file upload.
     * We use diskStorage to specify the destination and filename of the uploaded file.
     */
    @Roles(UserRole.PROFESSOR)
    @Post('/:id')
    @UseInterceptors(
        FileInterceptor('file', {
            // File Interception reffers to the process of uploading a file.
            // We must set this before the function to make it work.
            storage: diskStorage({
                destination: './media/silabos',
                filename: (req, file, cb) => {
                    const name =
                        file.originalname.split('.')[0] + // We use the original name of the file.
                        extname(file.originalname); // And the same extension.
                    cb(null, name); // We call the callback with the name of the file.
                    // A callback works to return the name of the file.
                },
            }),
        }),
    )
    /**
     * Now that the file is uploaded, we can use the uploadSilaboPdf method to save the file path in the database.
     * @param UploadedFile - We use Express.Multer.File to get the file from the request.
     * This request must sent a file with the key 'file' and a header 'Content-Type: multipart/form-data'.
     */
    async uploadSilaboPdf(
        @GetUser() user: User,
        @Param('id') courseId: string,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Course> {
        const pdfPath = file.filename;

        return this.silaboService.uploadSilaboPdf({ courseId, pdfPath });
    }
}
