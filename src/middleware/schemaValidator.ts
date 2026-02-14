import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../helper/globalResponse";

export const validateBody =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(400, result.error.message);
    }

    req.body = result.data;
    return next();
  };
