import express, { Request, Response } from 'express';
import Booking from '../models/Booking';  // Adjust import based on your file structure
import Stripe from 'stripe';
import Hotel from '../models/Hotel';
import Room from '../models/Room';
import verifyToken from '../middleware/auth';
import verifyTokenAdmin from '../middleware/verifyAdmin';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string );

// Utility function to convert DD/MM/YYYY to ISO 8601 format
const convertDateToISO = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day).toISOString();
  };

// ** Create a Booking **
router.post('/:hotelId/:roomId/booking', verifyTokenAdmin,async (req: Request, res: Response) => {
  const { hotelId, roomId } = req.params; // Extract hotelId and roomId from the URL parameters
  const {
    firstName,
    lastName,
    checkIn,
    checkOut,
    breakFastIncluded,
    currency,
    totalPrice,
    paymentStatus,
    paymentIntentId,
  } = req.body; // Extract other booking details from the request body

  try {
    // Create a new booking with the extracted data
    const booking = new Booking({
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
    await booking.save();

    // Update the Room document to include the new booking
    await Room.findByIdAndUpdate(roomId, {
      $push: { bookings: booking._id },
    });

    // Update the Hotel document to include the new booking
    await Hotel.findByIdAndUpdate(hotelId, {
      $push: { bookings: booking._id },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Something went wrong' });
  }
});

// ** Delete a Booking **
router.delete('booking/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  }  catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  
  }
});

// ** Edit a Booking **
router.put('booking/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  }  catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  
  }
});

// ** Find All Bookings for a Specific Hotel **
router.get('/:hotelId/bookings', async (req, res) => {
  try {
    const { hotelId } = req.params;
    const bookings = await Booking.find({ hotelId });
    res.status(200).json(bookings);
  }  catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  
  }
});

// ** Find All Bookings for a Specific Room **
router.get('/room/:roomId/bookings', async (req, res) => {
  try {
    const { roomId } = req.params;
    const bookings = await Booking.find({ roomId });
    res.status(200).json(bookings);
  }  catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  
  }
});


// Route to create a Payment Intent
router.post('booking/:bookingId/payment', async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { amount } = req.body; // Amount in cents
  
    try {
      // Validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
  
      // Create a Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        // Optionally, you can add other parameters like payment_method types
      });
      console.log(paymentIntent)
  
      // Find the booking and update it with payment details
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          paymentStatus: 'Pending', // or 'Confirmed' if payment is immediately confirmed
          paymentIntentId: paymentIntent.id,
        },
        { new: true }
      );
  
      if (!updatedBooking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
  
      // Respond with the client secret and updated booking
      res.json({
        clientSecret: paymentIntent.client_secret,
        updatedBooking,
      });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
      
      }
  });




export default router;
