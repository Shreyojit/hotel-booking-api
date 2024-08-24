import mongoose, { Document, Schema } from 'mongoose';

// Define the Booking interface
interface IBooking extends Document {
  hotelId: Schema.Types.ObjectId;
  roomId: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  startDate: Date;
  endDate: Date;
  breakFastIncluded: boolean;
  currency: string;
  totalPrice: number;
  paymentStatus: string;
  paymentIntentId: string;
  bookedAt: Date;
}

// Define the Booking schema
const bookingSchema = new Schema<IBooking>({
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  breakFastIncluded: { type: Boolean, default: false },
  currency: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, required: true },
  paymentIntentId: { type: String, required: true },
  bookedAt: { type: Date, default: Date.now },
});

// Create and export the Booking model
const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;
