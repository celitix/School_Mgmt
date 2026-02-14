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

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
