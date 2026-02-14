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

export const globalExceptionHandler = (status: number, message: string) => {
  const error: any = new Error();
  error.status = status;
  error.message = message;
  throw error;
};
