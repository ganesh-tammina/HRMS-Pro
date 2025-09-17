"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const database_1 = require("./config/database");
const mailer_1 = require("./routes/mailer");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
class Server {
    app;
    port;
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)({ origin: "*" }));
        this.port = Number(process.env.PORT);
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(express_1.default.json());
    }
    routes() {
        this.app.use("/candidates", employeeRoutes_1.default);
        this.app.post("/send-email", async (req, res) => {
            const { to, subject, text } = req.body;
            console.log(to);
            if (!to || !subject || !text) {
                return res.status(400).json({
                    success: false,
                    error: "Missing required fields (to, subject, text)",
                });
            }
            try {
                const result = await (0, mailer_1.sendMail)(to, subject, text, `<p>${text}</p>`);
                res.json({ success: true, messageId: result.messageId });
            }
            catch (error) {
                console.error("❌ Error in /send-email:", error);
                res.status(500).json({ success: false, error: "Failed to send email" });
            }
        });
    }
    start() {
        this.app.listen(this.port, async () => {
            const conn = await database_1.pool.getConnection();
            console.log(`✅ Server running on port ${this.port}`);
        });
    }
}
const server = new Server();
server.start();
//# sourceMappingURL=server.js.map