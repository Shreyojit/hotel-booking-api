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
const Booking_1 = __importDefault(require("../models/Booking")); // Adjust import based on your file structure
const stripe_1 = __importDefault(require("stripe"));
const Hotel_1 = __importDefault(require("../models/Hotel"));
const Room_1 = __importDefault(require("../models/Room"));
const verifyAdmin_1 = __importDefault(require("../middleware/verifyAdmin"));
const router = express_1.default.Router();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
// Utility function to convert DD/MM/YYYY to ISO 8601 format
const convertDateToISO = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day).toISOString();
};
// ** Create a Booking **
router.post('/:hotelId/:roomId/booking', verifyAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hotelId, roomId } = req.params; // Extract hotelId and roomId from the URL parameters
    const { firstName, lastName, checkIn, checkOut, breakFastIncluded, currency, totalPrice, paymentStatus, paymentIntentId, } = req.body; // Extract other booking details from the request body
    try {
        // Create a new booking with the extracted data
        const booking = new Booking_1.default({
            hotelId,
            roomId,
            firstName,
            lastName,
            checkIn,
            checkOut,
            breakFastIncluded,
            currency,
            totalPrice,
            paymentStatus,
            paymentIntentId,
        });
        // Save the booking to the database
        yield booking.save();
        // Update the Room document to include the new booking
        yield Room_1.default.findByIdAndUpdate(roomId, {
            $push: { bookings: booking._id },
        });
        // Update the Hotel document to include the new booking
        yield Hotel_1.default.findByIdAndUpdate(hotelId, {
            $push: { bookings: booking._id },
        });
        res.status(201).json(booking);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong' });
    }
}));
// ** Delete a Booking **
router.delete('booking/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const booking = yield Booking_1.default.findByIdAndDelete(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// ** Edit a Booking **
router.put('booking/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const booking = yield Booking_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// ** Find All Bookings for a Specific Hotel **
router.get('/:hotelId/bookings', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelId } = req.params;
        const bookings = yield Booking_1.default.find({ hotelId });
        res.status(200).json(bookings);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// ** Find All Bookings for a Specific Room **
router.get('/room/:roomId/bookings', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        const bookings = yield Booking_1.default.find({ roomId });
        res.status(200).json(bookings);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// Route to create a Payment Intent
router.post('booking/:bookingId/payment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId } = req.params;
    const { amount } = req.body; // Amount in cents
    try {
        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        // Create a Payment Intent
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            // Optionally, you can add other parameters like payment_method types
        });
        console.log(paymentIntent);
        // Find the booking and update it with payment details
        const updatedBooking = yield Booking_1.default.findByIdAndUpdate(bookingId, {
            paymentStatus: 'Pending', // or 'Confirmed' if payment is immediately confirmed
            paymentIntentId: paymentIntent.id,
        }, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        // Respond with the client secret and updated booking
        res.json({
            clientSecret: paymentIntent.client_secret,
            updatedBooking,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
exports.default = router;
