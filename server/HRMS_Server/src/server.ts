// src/server.ts
import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { pool } from "./config/database";
import candidateRoutes from "./routes/candidates";
import attendenceGetRouter from "./routes/candidates/attendance/attandanceGetRoutes";
import { sendMail } from "./routes/mailer";
import attendancePostRouter from "./routes/candidates/attendance/attandancePostRoutes";

dotenv.config();

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.app.use(cors({ origin: "*" }));
    this.port = Number(process.env.PORT);
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(express.json()); // ✅ parses req.body
  }

  private routes(): void {
    this.app.use("/candidates", candidateRoutes);
    this.app.use("/attendance", attendancePostRouter); // Ensure attendance routes are used
    this.app.use("/attendance", attendenceGetRouter); // Ensure attendance routes are used

    // send mail route
    this.app.post("/send-email", async (req, res) => {
      const { to, subject, text } = req.body;
      if (!to || !subject || !text) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields (to, subject, text)",
        });
      }
      try {
        const result = await sendMail(to, subject, text, `<p>${text}</p>`);
        res.json({ success: true, messageId: result.messageId });
      } catch (error) {
        res.status(500).json({ success: false, error: "Failed to send email" });
      }
    });
  }

  public start(): void {
    this.app.listen(this.port, async () => {
      await pool.getConnection();
      console.log(`✅ Server running on port ${this.port}`);
    });
  }
}

const server = new Server();
server.start();
