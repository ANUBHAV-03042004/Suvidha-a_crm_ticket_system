import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || `dbyaj2czt`,
  api_key: process.env.CLOUDINARY_API_KEY || `291247619851212`,
  api_secret: process.env.CLOUDINARY_API_SECRET || `_TxkeUr1FOXzHhn4PXCpZCTiV2M`,
});

export default cloudinary;