import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { pool } from './config/database';
import candidateRoutes from './routes';
import { sendMail } from './routes/mailer';
import postAdminRouter from './routes/Admin/adminMainPost';
import getAdminRouter from './routes/Admin/adminMainGet';
import postHolidaysRouter from './routes/Holidays/holidaysPost';
import AddEmployeeRoutes from './routes/Employees/Added_Employees_Route';
import leaveRouter from './routes/Leaves/route/leave.route';
import FgtRouter from './routes/Employee-Forgot-Password/route/forgot-route';
import getEmployyeeCredentialsRouter from './routes/Employees/Employee_Credentials';
import existingEmployeesRouter from './routes/ExistingEmployees/ExistingEmployees';
import StatusPutRouter from './routes/OfferStatus/OfferStatus';
import AtRouter from './routes/Attendance/attendance-route';
dotenv.config();

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors({ origin: '*' }));
    this.port = Number(process.env.PORT);
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use('/candidates', candidateRoutes);
    this.app.use('/', postAdminRouter);
    this.app.use('/', getAdminRouter);
    this.app.use('/holidays', postHolidaysRouter);
    this.app.use('/employees', AddEmployeeRoutes);
    this.app.use('/leave', leaveRouter);
    this.app.use('/', FgtRouter);
    this.app.use('/', existingEmployeesRouter)
    this.app.use('/offerstatus', StatusPutRouter)
    // this.app.use('/employee', getEmployyeeCredentialsRouter)
    this.app.use('/', AtRouter);

    this.app.post('/send-email', async (req, res) => {
      const { to, subject, text } = req.body;
      if (!to || !subject || !text) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields (to, subject, text)',
        });
      }
      try {
        const result = await sendMail(to, subject, text, `<p>${text}</p>`);
        res.json({ success: true, messageId: result.messageId });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to send email' });
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
