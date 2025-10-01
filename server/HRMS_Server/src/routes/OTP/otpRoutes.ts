import express from "express";
import { sendOtpController } from "./otpController";

const router = express.Router();

router.post("/send-otp", sendOtpController);

router.get("/send-otp", (req, res) => {
    res.status(200).json({ message: "OTP API is working ✅" });
});

export default router;