import express from "express";
import { sendOtpController } from "./otpController";

const router = express.Router();

router.post("/send-otp", sendOtpController);

export default router;