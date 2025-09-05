"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "sivameesala97@gmail.com",
        pass: "oeqmeufuahtgeksd",
    },
});
const sendMail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"My App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });
        console.log("✅ Email sent:", info.messageId);
        return info;
    }
    catch (err) {
        console.error("❌ Error sending email:", err);
        throw err;
    }
};
exports.sendMail = sendMail;
//# sourceMappingURL=mailer.js.map