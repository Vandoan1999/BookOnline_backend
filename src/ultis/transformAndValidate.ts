import { ClassType } from "class-transformer/ClassTransformer";
import { validate, ValidatorOptions } from "class-validator";
import { plainToClass } from "class-transformer";
import logger from "jet-logger";
export async function transformAndValidate<T>(cls: ClassType<T>, plain: any | any[], validatorOptions: ValidatorOptions = {}): Promise<T> {
  const transformed = plainToClass(cls, plain);

  const errors = await validate(transformed as any, Object.assign({ whitelist: true }, validatorOptions));

  if (errors.length) {
    logger.info(errors);
    throw {
      err: errors,
    };
  }

  return transformed;
}
