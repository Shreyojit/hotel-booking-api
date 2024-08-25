"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = require("cloudinary");
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const hotelRoutes_1 = __importDefault(require("./routes/hotelRoutes"));
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const ioredis_1 = __importDefault(require("ioredis"));
const app = (0, express_1.default)();
// Middleware setup
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// MongoDB connection
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
// Redis client setup using REDIS_URL environment variable
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = new ioredis_1.default(redisUrl);
client.on('connect', () => {
    console.log('Redis client connected');
});
client.on('error', (err) => {
    console.error('Redis connection error:', err);
});
// API routes
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/hotels", hotelRoutes_1.default);
app.use("/api/rooms", roomRoutes_1.default);
app.use("/api", bookingRoutes_1.default);
app.get("/api/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "hello from express endpoint!" });
}));
// Server setup
app.listen(7000, () => {
    console.log("Server running on port 7000!");
});
