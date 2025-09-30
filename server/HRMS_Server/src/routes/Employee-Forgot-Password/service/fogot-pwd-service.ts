import Joi from 'joi';
import { Request, Response } from 'express';
import { pool } from '../../../config/database';
import { sendMail } from '../../mailer';

interface RequestBody {
  email: string;
}

export class ForGotService {
  // --- Stronger Joi Schemas ---
  private static emailSchema = Joi.object({
    email: Joi.string().email().max(255).lowercase().required(),
  });

  private static otpSchema = Joi.object({
    email: Joi.string().email().max(255).lowercase().required(),
    otp: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required(),
  });

  private static passwordChangeSchema = Joi.object({
    email: Joi.string().email().max(255).lowercase().required(),
    otp: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required(),
    newPassword: Joi.string()
      .min(8)
      .max(64)
      .pattern(/[A-Z]/, 'uppercase letter')
      .pattern(/[a-z]/, 'lowercase letter')
      .pattern(/[0-9]/, 'number')
      .pattern(/[@$!%*?&#]/, 'special character')
      .required(),
  });

  // --- Email Validation & OTP Sending ---
  public static async emailValidation(req: Request, res: Response) {
    try {
      const { error, value } = ForGotService.emailSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error)
        return res
          .status(422)
          .json({ success: false, message: error.details[0]?.message });

      const [existing]: any = await pool.query(
        `SELECT companyEmail FROM employee_credentials WHERE companyEmail = ?`,
        [value.email]
      );

      if (!existing.length)
        return res
          .status(404)
          .json({ success: false, message: 'Email not found.' });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Remove any active OTP
      await pool.query(
        `DELETE FROM password_change_otp WHERE email = ? AND status = 'active'`,
        [value.email]
      );

      // Insert new OTP
      await pool.query(
        `INSERT INTO password_change_otp (email, otp, status) VALUES (?, ?, 'active')`,
        [value.email, otp]
      );

      await ForGotService.sendMail(
        value.email,
        'Password Reset OTP',
        `Your OTP is ${otp}`,
        `<p>Your OTP for password reset is <b>${otp}</b>. It will expire in 5 minutes.</p>
         <a href="http://30.0.0.78:4200/login">Click here to reset your password</a>
        `
      );

      return res.json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
      console.error('Error in emailValidation:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  // --- Change Password ---
  public static async changePassword(req: Request, res: Response) {
    try {
      const { error, value } = ForGotService.passwordChangeSchema.validate(
        req.body,
        {
          abortEarly: false,
        }
      );
      if (error)
        return res
          .status(422)
          .json({ success: false, message: error.details[0]?.message });

      const { email, otp, newPassword } = value;

      const [rows]: any = await pool.query(
        `SELECT * FROM password_change_otp 
         WHERE email = ? AND otp = ? AND status = 'active' 
         ORDER BY createdAt DESC LIMIT 1`,
        [email, otp]
      );

      if (!rows.length)
        return res
          .status(400)
          .json({ success: false, message: 'Invalid or already used OTP' });

      const otpRecord = rows[0];
      const createdAt = new Date(otpRecord.createdAt);
      const now = new Date();
      const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

      if (diffMinutes > 5) {
        await pool.query(
          `UPDATE password_change_otp SET status = 'expired' WHERE sl_no = ?`,
          [otpRecord.sl_no]
        );
        return res
          .status(410)
          .json({
            success: false,
            message: 'OTP expired. Please request a new one.',
          });
      }

      // Update password
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

  // --- Signup OTP ---
  public static async thisissignup(req: Request, res: Response) {
    try {
      const { error, value } = ForGotService.emailSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error)
        return res
          .status(422)
          .json({ success: false, message: error.details[0]?.message });

      const [existing]: any = await pool.query(
        `SELECT email FROM employees WHERE email = ?`,
        [value.email]
      );

      if (!existing.length)
        return res
          .status(404)
          .json({ success: false, message: 'Email not found.' });

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
        `<p>Your OTP for password reset is <b>${otp}</b>. It will expire in 5 minutes.</p>
        `
      );

      return res.json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
      console.error('Error in thisissignup:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  // --- After Signup Add Password ---
  public static async after_signup_adding_the_password_here(
    req: Request,
    res: Response
  ) {
    try {
      const { error, value } = ForGotService.passwordChangeSchema.validate(
        req.body,
        {
          abortEarly: false,
        }
      );

      if (error)
        return res
          .status(422)
          .json({ success: false, message: error.details[0]?.message });

      const { email, otp, newPassword } = value;

      const [rows]: any = await pool.query(
        `SELECT * FROM password_change_otp 
         WHERE email = ? AND otp = ? AND status = 'active' 
         ORDER BY createdAt DESC LIMIT 1`,
        [email, otp]
      );

      if (!rows.length)
        return res
          .status(400)
          .json({ success: false, message: 'Invalid or already used OTP' });

      const otpRecord = rows[0];
      const createdAt = new Date(otpRecord.createdAt);
      const now = new Date();
      const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

      if (diffMinutes > 5) {
        await pool.query(
          `UPDATE password_change_otp SET status = 'expired' WHERE sl_no = ?`,
          [otpRecord.sl_no]
        );
        return res
          .status(410)
          .json({
            success: false,
            message: 'OTP expired. Please request a new one.',
          });
      }

      try {
        const [employee_id]: any = await pool.query(
          `SELECT employee_id FROM employees WHERE email = ?`,
          [email]
        );

        const empId = employee_id[0].employee_id;

        await pool.query(
          `INSERT INTO employee_credentials (employee_id, companyEmail, password) VALUES (?, ?, ?)`,
          [empId, email, newPassword]
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
        console.error('Error in after_signup_adding_the_password_here:', err);
        return res
          .status(500)
          .json({ success: false, message: 'Internal server error' });
      }
    } catch (e) {
      console.error('Error in after_signup_adding_the_password_here:', e);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  // --- Mail Helper ---
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
