import type { Request, Response } from "express";
import { AppError, globalResponse } from "../../helper/globalResponse";

export const login = (req: Request, res: Response) => {
  try {
    globalResponse(200, "Success", null, res);
  } catch (e: any) {
    throw new AppError(500, e.message);
  }
};
