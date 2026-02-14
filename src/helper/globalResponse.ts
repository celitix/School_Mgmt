import { Response } from "express";

export const globalResponse = (
  status: number,
  message: string,
  data: any,
  res: Response,
) => {
  return res.status(status).json({
    status,
    message,
    data,
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
