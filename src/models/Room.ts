import mongoose, { Document, Schema } from 'mongoose';

// Define the Room interface
interface IRoom extends Document {
  title: string;
  description: string;
  bedCount: number;
  guestCount: number;
  kingBed: number;
  queenBed: number;
  breakFastPrice: number;
  roomPrice: number;
  imageUrls: string[];
  hotelId: Schema.Types.ObjectId;
  bookings: Schema.Types.ObjectId[];
}

// Define the Room schema
const roomSchema = new Schema<IRoom>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  bedCount: { type: Number, default: 0 },
  guestCount: { type: Number, default: 0 },
  kingBed: { type: Number, default: 0 },
  queenBed: { type: Number, default: 0 },
  breakFastPrice: { type: Number, default: 0 },
  roomPrice: { type: Number, default: 0 },
  imageUrls: [{ type: String }],
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
});

// Create and export the Room model
const Room = mongoose.model<IRoom>('Room', roomSchema);
export default Room;
