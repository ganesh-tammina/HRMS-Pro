"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mailer_1 = require("./mailer");
// ✅ Load .env before using process.env
dotenv_1.default.config();
class Server {
    app;
    port;
    constructor() {
        this.app = (0, express_1.default)();
        this.port = Number(process.env.PORT) || 3562;
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(express_1.default.json());
        // ✅ Enable CORS for all requests
        this.app.use((0, cors_1.default)({ origin: '*' }));
    }
    routes() {
        // Test route to check .env
        this.app.get('/', (req, res) => {
            res.send(process.env.RU || 'API is running...');
        });
        this.app.get('/fallback', (req, res) => {
            res.send('API is not running...');
        });
        // ✅ Email sending route
        this.app.post('/send-email', async (req, res) => {
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
        this.app.listen(this.port, () => {
            console.log(`✅ Server running on port http://localhost:${this.port}`);
        });
    }
}
const server = new Server();
server.start();
//# sourceMappingURL=server.js.map