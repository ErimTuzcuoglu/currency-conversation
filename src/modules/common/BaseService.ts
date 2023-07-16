import { ClassTransformOptions, plainToInstance } from 'class-transformer';

export class BaseService {
  mapSourceToTarget<S, T>(
    source: S,
    target: any,
    options: ClassTransformOptions = {
      excludeExtraneousValues: true,
    },
  ): T | T[] {
    return plainToInstance<T, S>(target, source, options);
  }
}
