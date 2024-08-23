import express, { Request, Response } from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import { v2 as cloudinary, UploadApiResponse, 
    UploadApiErrorResponse } from 'cloudinary';
    import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  
  
  mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.get("/api/test", async(req:Request,res:Response) => {
    res.json({ message: "hello from express endpoint!"});
});

app.listen(7000,()=>{
    console.log("server running on port 7000!")
});