import { Response } from "express";

export const globalResponse = (
  status: number,
  data: { message: string; success: boolean },
  res: Response,
) => {
  return res.status(status).json({
    ...data,
  });
};

export class AppError extends Error {
  status: number;
  success: boolean;
  constructor(status: number, message: string, success?: boolean) {
    super(message);
    this.status = status;
    this.success = false;
  }
}
