import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    StreamableFile,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Intercepts the execution context and handles the call.
 * @param context The execution context.
 * @param next The call handler.
 * @returns An observable that emits the transformed data.
 *
 * Using this transform interceptor, we can transform the response data before it is sent to the client.
 * That way all the @Expose() and @Exclude() decorators will be applied to the response data.
 *
 * To set it globally, we add it in the main.ts file:
 * app.useGlobalInterceptors(new TransformInterceptor());
 *
 * We can also set it for a specific controller or method by adding it in the controller or method decorator:
 * @UseInterceptors(TransformInterceptor)
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                /**
                 * We must skip the transformation if the data is a StreamableFile instance.
                 * This is because the StreamableFile class is not a class-transformer entity.
                 * If we try to transform it, we will get an error.
                 */
                if (data instanceof StreamableFile) {
                    return data;
                }
                return instanceToPlain(data);
            }),
        );
    }
}
