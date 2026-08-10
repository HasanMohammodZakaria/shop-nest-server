import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

/**
 * Validates req.body / req.query / req.params against a Zod schema.
 * Usage: router.post('/', validateRequest(authValidation.registerSchema), controller.register)
 */
const validateRequest = (schema: ZodType) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;