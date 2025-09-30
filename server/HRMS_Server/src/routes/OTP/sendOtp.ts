import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export const sendOtp = async (mobileNumber: string, otp: number) => {
    try {
        const message = await client.messages.create({
            body: `Hi your OTP is ${otp} for HRMS login. Do not share it with anyone.`,
            from: process.env.TWILIO_PHONE!,
            to: '+91 9676161393',
        });
        console.log("✅ OTP sent:", message.sid);
        return true;
    } catch (error) {
        console.error("❌ OTP sending failed:", error);
        return false;
    }
};
