import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './utils/transform.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger();
    const app = await NestFactory.create(AppModule);
    /**
     * Enable CORS globally
     * We can enable CORS globally by calling the enableCors() method on the app object.
     * To set it to a specific origin, we can pass an object with the origin property set to the desired origin.
     * To allow all origins, we can set the origin property to '*' or just leave it empty.
     * e.g. app.enableCors({ origin: 'my-website.com' });
     *
     * We can also set the allowed headers and methods by passing an object with the
     * headers and methods properties set to the desired values.
     * @example - app.enableCors({ origin: '*', headers: 'Content-Type', methods: 'GET, POST' });
     * To set it on a specific route, we can use the @UseGuards() decorator on the controller or method.
     * @example @UseGuards(CorsGuard)
     */
    app.enableCors({ origin: '*' });
    /**
     * Enable validation with DTOs globally
     * We can enable validation globally by calling the useGlobalPipes() method on the app object.
     * Basically we are adding a global pipe to the application.
     * Doing this will enable validation for all incoming requests.
     * Meaning that all incoming requests will be validated against the DTOs we created.
     * If the request does not match the DTO, an error will be thrown.
     */
    app.useGlobalPipes(new ValidationPipe());
    /**
     * Enable the transform interceptor
     * We can enable the transform interceptor globally by calling the useGlobalInterceptors() method on the app object.
     * Doing this will transform the response data before it is sent to the client.
     * Basically when the server fetches data from the database, it will transform the data using the class-transformer library.
     * Allowing us to use the @Expose() and @Exclude() decorators in our entities.
     */
    app.useGlobalInterceptors(new TransformInterceptor()); // Add this line to enable the transform interceptor
    const port = process.env.PORT;
    await app.listen(port);
    logger.log(`Application listening on port ${port}`);
}
bootstrap();
