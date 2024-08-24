import express, { Request, Response } from 'express';
import Booking from '../models/Booking';  // Adjust import based on your file structure
import Stripe from 'stripe';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string );

// Utility function to convert DD/MM/YYYY to ISO 8601 format
const convertDateToISO = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day).toISOString();
  };

// ** Create a Booking **
router.post('/', async (req: Request, res: Response) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
  }
);

// ** Delete a Booking **
router.delete('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.get('/:hotelId', async (req, res) => {
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
router.get('/room/:roomId', async (req, res) => {
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
router.post('/:bookingId/payment', async (req: Request, res: Response) => {
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
