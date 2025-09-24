import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USE3R || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "hrms_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
});
