import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });


// Create Cloudinary storage instance
const storage = new CloudinaryStorage({
  cloudinary,
 
});

// Create multer instance
const upload = multer({ storage });

export { cloudinary, storage, upload };
