import express from "express";
import { validateBody } from "../middleware/schemaValidator";
import { sendOtpBody, verifyOtpBody } from "../schema/auth.schema";
import { sendOtp, verifyOtp } from "../controller/auth/auth.controller";

const router = express.Router();

/**
 * @swagger
 * /api/auth/sendOtp:
 *   post:
 *     summary: Send OTP to mobile number
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *                 description: 10 digit Indian mobile number (without +91)
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *                 otpId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *
 *       400:
 *         description: Invalid phone number
 *
 *       500:
 *          description: Failed to generate OTP
 *
 *       429:
 *         description: Too many OTP requests
 */

router.post("/sendOtp", validateBody(sendOtpBody), sendOtp);

/**
 * @swagger
 * /api/auth/verifyOtp:
 *   post:
 *     summary: Verify OTP and authenticate user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *               - otpId
 *             properties:
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *                 description: 10 digit Indian mobile number
 *               otp:
 *                 type: string
 *                 example: 482913
 *                 description: 6 digit OTP sent to phone
 *               otpId:
 *                 type: string
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *                 description: OTP record id returned from sendOtp
 *
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP verified
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *       400:
 *         description: OTP validation error
 *         content:
 *           application/json:
 *             examples:
 *               invalidOtp:
 *                 summary: Invalid OTP
 *                 value:
 *                   success: false
 *                   message: Invalid OTP
 *               expiredOtp:
 *                 summary: OTP expired
 *                 value:
 *                   success: false
 *                   message: OTP expired
 *
 *       404:
 *         description: OTP not found
 *
 *       429:
 *         description: OTP attempts limit exceeded. Please resend OTP.
 */

router.post("/verifyOtp", validateBody(verifyOtpBody), verifyOtp);

export default router;
