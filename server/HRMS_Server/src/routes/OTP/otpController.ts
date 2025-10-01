import { Request, Response } from "express";
import { sendOtp } from "./sendOtp";

export const sendOtpController = async (req: Request, res: Response) => {
    const { mobile } = req.body;

    if (!mobile) {
        return res.status(400).json({ message: "Mobile number required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const sent = await sendOtp(mobile, otp);

    if (sent) {
        return res.status(200).json({ message: "OTP sent successfully" });
    } else {
        return res.status(500).json({ message: "Failed to send OTP" });
    }
};
