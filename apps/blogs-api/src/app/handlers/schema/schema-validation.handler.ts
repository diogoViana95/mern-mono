import { NextFunction, Response } from 'express';
import { AnyZodObject, z, ZodType } from 'zod';
import { Req } from '../../models';

type validationObject<T> = {
  [k in keyof T]: ZodType<T[k]>;
};

export const generateValidationSchema = <
  TBODY = unknown,
  TQUERY = unknown,
  TPARAMS = unknown
>({
  body,
  params,
  query,
}: {
  body?: validationObject<TBODY>;
  query?: validationObject<TQUERY>;
  params?: validationObject<TPARAMS>;
}) => {
  return z.object({
    body: body ? z.object(body) : z.object({}),
    query: query ? z.object(query) : z.object({}),
    params: params ? z.object(params) : z.object({}),
  });
};

export const validate = (schema: AnyZodObject) => {
  return async (req: Req, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };
};
