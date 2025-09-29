import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "30.0.0.78",
  user: process.env.DB_USE3R || "user",
  password: process.env.DB_PASSWORD || "user",
  database: process.env.DB_NAME || "hrms_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
});
