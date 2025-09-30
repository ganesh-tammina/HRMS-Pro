import Joi from 'joi';
import { Request, Response } from 'express';
import { pool } from '../../../config/database';
import { sendMail } from '../../mailer';

interface RequestBody {
  email: string;
}

export class ForGotService {
  private static sanitizedEmail = Joi.object({
    email: Joi.string().email().required(),
  });

  public static async emailValidation(req: Request, res: Response) {
    try {
      const email: RequestBody = req.body;
      const { error, value } = ForGotService.sanitizedEmail.validate(email, {
        abortEarly: false,
      });

      if (error) {
        return res
          .status(422)
          .json({ success: false, message: error.details[0]?.message });
      }

      const [tammy]: any = await pool.query(
        `SELECT companyEmail FROM employee_credentials WHERE companyEmail = ?`,
        [value.email]
      );

      if (!tammy.length) {
        return res.status(404).json({
          success: false,
          message: 'Email not found.',
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await pool.query(
        `DELETE FROM password_change_otp WHERE email = ? AND status = 'active'`,
        [value.email]
      );

      await pool.query(
        `INSERT INTO password_change_otp (email, otp, status) VALUES (?, ?, 'active')`,
        [value.email, otp]
      );

      await ForGotService.sendMail(
        value.email,
        'Password Reset OTP',
        `Your OTP is ${otp}`,
        `<p>Your OTP for password reset is <b>${otp}</b>. It will expire in 5 minutes.</p>`
      );

      return res.json({
        success: true,
        message: 'OTP sent successfully',
      });
    } catch (err) {
      console.error('Error in emailValidation:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  public static async changePassword(req: Request, res: Response) {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required(),
        newPassword: Joi.string().min(4).required(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(422)
          .json({ success: false, message: error.details[0]?.message });
      }

      const { email, otp, newPassword } = value;

      const [rows]: any = await pool.query(
        `SELECT * FROM password_change_otp 
         WHERE email = ? AND otp = ? AND status = 'active' 
         ORDER BY createdAt DESC LIMIT 1`,
        [email, otp]
      );

      if (!rows.length) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or already used OTP',
        });
      }

      const otpRecord = rows[0];
      const createdAt = new Date(otpRecord.createdAt);
      const now = new Date();
      const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

      if (diffMinutes > 5) {
        await pool.query(
          `UPDATE password_change_otp SET status = 'expired' WHERE sl_no = ?`,
          [otpRecord.sl_no]
        );
        return res.status(410).json({
          success: false,
          message: 'OTP expired. Please request a new one.',
        });
      }

      await pool.query(
        `UPDATE employee_credentials SET password = ? WHERE companyEmail = ?`,
        [newPassword, email]
      );

      await pool.query(
        `UPDATE password_change_otp SET status = 'used' WHERE sl_no = ?`,
        [otpRecord.sl_no]
      );

      return res.json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (err) {
      console.error('Error in changePassword:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  private static async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ) {
    try {
      await sendMail(to, subject, text, html);
    } catch (e) {
      console.error('Error sending mail:', e);
      throw e;
    }
  }
}
