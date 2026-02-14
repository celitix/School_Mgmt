import express from "express";
import { validateBody } from "../middleware/schemaValidator";
import { sendOtpBody, verifyOtpBody } from "../schema/auth.schema";
import { sendOtp, verifyOtp } from "../controller/auth/auth.controller";

const router = express.Router();

router.post("/sendOtp", validateBody(sendOtpBody), sendOtp);
router.post("/verifyOtp", validateBody(verifyOtpBody), verifyOtp);

export default router;
