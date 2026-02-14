import type { Request, Response } from "express";
import { AppError, globalResponse } from "../../helper/globalResponse";
import { prisma } from "../../lib/prisma";
import {
  compareValue,
  generateAccessToken,
  isOtpExpired,
} from "../../helper/authUtils";

export const sendOtp = (req: Request, res: Response) => {
  try {
    globalResponse(
      200,
      { message: "OTP send successfully", success: true },
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
      throw new AppError(400, "Phone number does not exist");
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
