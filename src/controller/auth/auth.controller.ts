import type { Request, Response } from "express";
import { AppError, globalResponse } from "../../helper/globalResponse";
import { prisma } from "../../lib/prisma";
import {
  compareValue,
  generateAccessToken,
  generateCode,
  hashValue,
  isOtpExpired,
  otpExpiry,
} from "../../helper/authUtils";

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    const isUserExist = await prisma.users.findUnique({ where: { phone } });

    if (!isUserExist) {
      throw new AppError(400, "Invalid phone number");
    }

    let generateOtp = generateCode(6, "number");
    const app_env = process.env.APP_ENV;

    if (app_env === "development") {
      generateOtp = "123456";
    }

    if (!generateOtp) {
      throw new AppError(500, "Failed to generate OTP");
    }

    const otp = await prisma.otp.create({
      data: {
        phone,
        otp: await hashValue(generateOtp),
        expiresAt: otpExpiry(),
      },
    });

    globalResponse(
      200,
      { message: "OTP send successfully", success: true, otpId: otp.id },
      res,
    );
  } catch (e: any) {
    throw new AppError(500, e.message);
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, otp, otpId } = req.body;

    const isPhoneExist = await prisma.otp.findFirst({
      where: { phone, id: otpId },
    });

    if (!isPhoneExist) {
      throw new AppError(404, "Otp not found");
    }

    const compareOtp = compareValue(otp, isPhoneExist.otp);

    if (!compareOtp) {
      await prisma.otp.update({
        where: { id: otpId },
        data: {
          attempts: isPhoneExist.attempts + 1,
        },
      });
      throw new AppError(400, "Invalid OTP");
    }

    const isExpired = isOtpExpired(isPhoneExist.expiresAt);

    if (isExpired) {
      throw new AppError(400, "OTP expired");
    }

    const maxAttempts = Number(process.env.OTP_ATTEMPT) || 5;
    const attempt = isPhoneExist.attempts >= maxAttempts;

    if (!attempt) {
      throw new AppError(
        400,
        "OTP attempts limit exceeded. Please resend OTP.",
      );
    }

    const user = await prisma.users.findFirst({
      where: { phone },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    const token = generateAccessToken({
      id: isPhoneExist.id,
      role: user?.role?.name || "user",
    });

    globalResponse(
      200,
      { message: "OTP verified successfully", success: true, token },
      res,
    );
  } catch (e: any) {
    throw new AppError(500, e.message);
  }
};
