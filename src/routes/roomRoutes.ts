import express, { Request, Response } from 'express';
import Room from '../models/Room';
import { upload } from '../services/cloudinaryServices';


const router = express.Router();

// Create a new room
router.post('/', upload.array('images', 10), async (req: Request, res: Response) => {
  try {
    // Type assertion for req.files to be Express.Multer.File[]
    const files = req.files as Express.Multer.File[];
    const imageUrls = files?.map((file) => file.path) || [];

    // Ensure req.body contains valid data
    const {
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
    } = req.body;

    const room = new Room({
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

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

// Get all rooms
router.get('/', async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find().populate('hotelId');
    res.json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

// Get a single room by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotelId').populate('bookings');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

// Update a room
router.put('/:id', upload.array('images', 10), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const imageUrls = files?.map((file) => file.path) || [];

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { ...req.body, imageUrls },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(updatedRoom);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

// Delete a room
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

export default router;
