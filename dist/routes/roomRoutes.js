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
const Room_1 = __importDefault(require("../models/Room"));
const cloudinaryServices_1 = require("../services/cloudinaryServices");
const router = express_1.default.Router();
// Create a new room
router.post('/', cloudinaryServices_1.upload.array('images', 10), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Type assertion for req.files to be Express.Multer.File[]
        const files = req.files;
        const imageUrls = (files === null || files === void 0 ? void 0 : files.map((file) => file.path)) || [];
        // Ensure req.body contains valid data
        const { title, description, bedCount, guestCount, kingBed, queenBed, breakFastPrice, roomPrice, roomService, TV, balcony, freeWifi, cityView, oceanView, forestView, mountainView, airCondition, soundProof, hotelId, } = req.body;
        const room = new Room_1.default({
            title,
            description,
            bedCount,
            guestCount,
            kingBed,
            queenBed,
            breakFastPrice,
            roomPrice,
            roomService,
            TV,
            balcony,
            freeWifi,
            cityView,
            oceanView,
            forestView,
            mountainView,
            airCondition,
            soundProof,
            hotelId,
            imageUrls,
        });
        yield room.save();
        res.status(201).json(room);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// Get all rooms
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield Room_1.default.find().populate('hotelId');
        res.json(rooms);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// Get a single room by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield Room_1.default.findById(req.params.id).populate('hotelId').populate('bookings');
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// Update a room
router.put('/:id', cloudinaryServices_1.upload.array('images', 10), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const imageUrls = (files === null || files === void 0 ? void 0 : files.map((file) => file.path)) || [];
        const updatedRoom = yield Room_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { imageUrls }), { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(updatedRoom);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// Delete a room
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRoom = yield Room_1.default.findByIdAndDelete(req.params.id);
        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({ message: 'Room deleted successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
exports.default = router;
