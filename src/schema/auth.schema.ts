import { z } from "zod";

const sendOtp = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter valid 10 digit mobile number"),
});

const verifyOtp = z.object({
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),

  otpId: z.string(),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter valid 10 digit mobile number"),
});

export { sendOtp, verifyOtp };
