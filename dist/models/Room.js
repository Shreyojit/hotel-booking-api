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
// Define the Room schema
const roomSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    bedCount: { type: Number, default: 0 },
    guestCount: { type: Number, default: 0 },
    kingBed: { type: Number, default: 0 },
    queenBed: { type: Number, default: 0 },
    breakFastPrice: { type: Number, default: 0 },
    roomPrice: { type: Number, default: 0 },
    imageUrls: [{ type: String }],
    hotelId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    bookings: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Booking' }],
});
// Create and export the Room model
const Room = mongoose_1.default.model('Room', roomSchema);
exports.default = Room;
