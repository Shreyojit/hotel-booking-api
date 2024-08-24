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
const Hotel_1 = __importDefault(require("../models/Hotel"));
const cloudinaryServices_1 = require("../services/cloudinaryServices");
const router = express_1.default.Router();
// Create a new hotel
router.post('/', cloudinaryServices_1.upload.array('images', 10), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Type assertion for req.files to be Express.Multer.File[]
        const files = req.files;
        const imageUrls = (files === null || files === void 0 ? void 0 : files.map((file) => file.path)) || [];
        // Ensure req.body contains valid data
        const { title, description, state, city, locationDescription, gym, spa, restaurant, freeParking, bikeRental, freeWifi, movieNights, coffeeShop, swimmingPool } = req.body;
        console.log(description);
        const hotel = new Hotel_1.default({
            title,
            description,
            state,
            city,
            locationDescription,
            gym,
            spa,
            restaurant,
            freeParking,
            bikeRental,
            freeWifi,
            movieNights,
            coffeeShop,
            swimmingPool,
            imageUrls,
        });
        yield hotel.save();
        res.status(201).json(hotel);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// Get all hotels
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield Hotel_1.default.find();
        res.json(hotels);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// Get a single hotel by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotel = yield Hotel_1.default.findById(req.params.id).populate('rooms').populate('bookings');
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json(hotel);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// Update a hotel
router.put('/:id', cloudinaryServices_1.upload.array('images', 10), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const imageUrls = (files === null || files === void 0 ? void 0 : files.map((file) => file.path)) || [];
        const updatedHotel = yield Hotel_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { imageUrls }), { new: true });
        if (!updatedHotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json(updatedHotel);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// Delete a hotel
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedHotel = yield Hotel_1.default.findByIdAndDelete(req.params.id);
        if (!deletedHotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json({ message: 'Hotel deleted successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
exports.default = router;
