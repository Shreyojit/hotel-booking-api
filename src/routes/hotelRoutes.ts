import express, { Request, Response } from 'express';
import Hotel from '../models/Hotel';
import { upload } from '../services/cloudinaryServices';
import multer from 'multer';

const router = express.Router();


// Create a new hotel
router.post('/', upload.array('images', 10), async (req: Request, res: Response) => {
  try {
    // Type assertion for req.files to be Express.Multer.File[]
    const files = req.files as Express.Multer.File[];
    const imageUrls = files?.map((file) => file.path) || [];
    
    // Ensure req.body contains valid data
    const { title, description, state, city, locationDescription, gym, spa, restaurant, freeParking, bikeRental, freeWifi, movieNights, coffeeShop, swimmingPool } = req.body;
   console.log(description)
    const hotel = new Hotel({
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
    
    await hotel.save();
    res.status(201).json(hotel);
  }catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

// Get all hotels
router.get('/', async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

// Get a single hotel by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('rooms').populate('bookings');
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  }catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

// Update a hotel
router.put('/:id', upload.array('images', 10), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const imageUrls = files?.map((file) => file.path) || [];

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, imageUrls },
      { new: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(updatedHotel);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

// Delete a hotel
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!deletedHotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

export default router;
