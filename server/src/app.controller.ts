import {
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    StreamableFile,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

/**
 * Controller that handles file-related operations.
 * In this case we only set a module and a controller to handle the file download.
 * @class StreamableFile - A class that represents a file that can be streamed.
 * @method getFile - A method that returns a file to be streamed.
 *
 * We created this on the main app.controller.ts file because we only need to handle the file download.
 * We set this unique controller to the controllers array in the app.module.ts file.
 */
@Controller('file')
export class FilesController {
    @Get('silabo/:filepath')
    getFile(@Param('filepath') fileName: string): StreamableFile {
        try {
            const file = createReadStream(
                join(process.cwd(), 'media/silabos', fileName),
            );
            return new StreamableFile(file);
        } catch (error) {
            throw new InternalServerErrorException('Error reading the file');
        }
    }
}
