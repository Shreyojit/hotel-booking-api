"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the Booking schema
const bookingSchema = new mongoose_1.Schema({
    hotelId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Room', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    checkIn: { type: Date, required: true }, // Updated field
    checkOut: { type: Date, required: true }, // Updated field
    breakFastIncluded: { type: Boolean, default: false },
    currency: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
    paymentIntentId: { type: String, required: true },
    bookedAt: { type: Date, default: Date.now },
});
// Create and export the Booking model
const Booking = mongoose_1.default.model('Booking', bookingSchema);
exports.default = Booking;
