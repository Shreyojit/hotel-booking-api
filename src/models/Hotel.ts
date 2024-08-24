import mongoose, { Document, Schema } from 'mongoose';

// Define the Hotel interface
interface IHotel extends Document {
  title: string;
  description: string;
  state: string;
  city: string;
  locationDescription: string;
  gym: boolean;
  spa: boolean;
  restaurant: boolean;
  freeParking: boolean;
  bikeRental: boolean;
  freeWifi: boolean;
  movieNights: boolean;
  coffeeShop: boolean;
  swimmingPool: boolean;
  addedAt: Date;
  updatedAt: Date;
  imageUrls: string[];
  rooms: Schema.Types.ObjectId[];
  bookings: Schema.Types.ObjectId[];
}

// Define the Hotel schema
const hotelSchema = new Schema<IHotel>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  locationDescription: { type: String, required: true },
  gym: { type: Boolean, default: false },
  spa: { type: Boolean, default: false },
  restaurant: { type: Boolean, default: false },
  freeParking: { type: Boolean, default: false },
  bikeRental: { type: Boolean, default: false },
  freeWifi: { type: Boolean, default: false },
  movieNights: { type: Boolean, default: false },
  coffeeShop: { type: Boolean, default: false },
  swimmingPool: { type: Boolean, default: false },
  addedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  imageUrls: [{ type: String }],
  rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
});

// Create and export the Hotel model
const Hotel = mongoose.model<IHotel>('Hotel', hotelSchema);
export default Hotel;
