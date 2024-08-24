"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const verifyTokenAdmin = (req, res, next) => {
    // Use the verifyToken middleware to check if the token is valid
    (0, auth_1.default)(req, res, () => {
        if (req.isAdmin) {
            return next(); // User is an admin, proceed to the next middleware
        }
        return res.status(403).json({ message: "Access denied" }); // User is not an admin
    });
};
exports.default = verifyTokenAdmin;
