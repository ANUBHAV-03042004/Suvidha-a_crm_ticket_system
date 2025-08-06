import mongoose from 'mongoose';
import cloudinary from './config/cloudinary.js';
import Ticket from './models/Ticket.js';

// Helper function to check if URL is a Cloudinary URL
const isCloudinaryUrl = (url) => {
  return url && url.includes('res.cloudinary.com');
};

// Helper function to extract publicId from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  try {
    // Only process Cloudinary URLs
    if (!isCloudinaryUrl(url)) {
      console.log('Skipping non-Cloudinary URL:', url);
      return null;
    }

    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    
    if (uploadIndex === -1) {
      console.error('Invalid Cloudinary URL: no "upload" segment', { url });
      return null;
    }

    // Get the part after 'upload'
    let startIndex = uploadIndex + 1;
    
    // Skip version if present (starts with 'v' followed by numbers)
    if (parts[startIndex] && parts[startIndex].startsWith('v') && /^v\d+$/.test(parts[startIndex])) {
      startIndex++;
    }

    // Join the remaining parts and remove file extension
    const publicIdWithExt = parts.slice(startIndex).join('/');
    const publicId = publicIdWithExt.split('.')[0]; // Remove extension
    
    console.log('Extracted publicId:', publicId, 'from URL:', url);
    return publicId;
  } catch (error) {
    console.error('Error extracting publicId from URL:', { url, error: error.message });
    return null;
  }
};

const cleanupCloudinaryImages = async () => {
  try {
    // Add this debugging line
    console.log('Starting Cloudinary cleanup script...');
    console.log('MongoDB URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all tickets with images
    const tickets = await Ticket.find({
      $or: [
        { invoice: { $exists: true, $ne: null } },
        { product_image: { $exists: true, $ne: null } },
      ],
    });

    console.log(`Found ${tickets.length} tickets with images`);

    // Collect all publicIds in use from Cloudinary URLs only
    const usedPublicIds = new Set();
    let cloudinaryUrlCount = 0;
    let localFileCount = 0;

    tickets.forEach((ticket, index) => {
      console.log(`Processing ticket ${index + 1}/${tickets.length}: ${ticket._id}`);
      
      if (ticket.invoice) {
        if (isCloudinaryUrl(ticket.invoice)) {
          const publicId = getPublicIdFromUrl(ticket.invoice);
          if (publicId) {
            usedPublicIds.add(publicId);
            cloudinaryUrlCount++;
          }
        } else {
          localFileCount++;
          console.log('Local invoice file found:', ticket.invoice);
        }
      }
      
      if (ticket.product_image) {
        if (isCloudinaryUrl(ticket.product_image)) {
          const publicId = getPublicIdFromUrl(ticket.product_image);
          if (publicId) {
            usedPublicIds.add(publicId);
            cloudinaryUrlCount++;
          }
        } else {
          localFileCount++;
          console.log('Local product image file found:', ticket.product_image);
        }
      }
    });

    console.log(`Summary:
      - Cloudinary URLs found: ${cloudinaryUrlCount}
      - Local file paths found: ${localFileCount}
      - Unique publicIds in use: ${usedPublicIds.size}`);

    if (usedPublicIds.size === 0) {
      console.log('No Cloudinary URLs found in database. Nothing to cleanup.');
      await mongoose.disconnect();
      return;
    }

    console.log('Used publicIds:', Array.from(usedPublicIds));

    // Fetch all images in Cloudinary 'tickets' folder
    console.log('Fetching images from Cloudinary...');
    
    // Test Cloudinary connection first
    try {
      console.log('Testing Cloudinary API connection...');
      const testResult = await cloudinary.api.ping();
      console.log('Cloudinary ping successful:', testResult);
    } catch (pingError) {
      console.error('Cloudinary ping failed:', {
        name: pingError.name,
        message: pingError.message,
        code: pingError.http_code,
        stack: pingError.stack
      });
      throw pingError;
    }
    
    let allCloudinaryResources = [];
    let nextCursor = null;

    do {
      try {
        const options = {
          resource_type: 'image',
          type: 'upload',  // This was missing!
          prefix: 'tickets/',
          max_results: 500,
        };
        
        if (nextCursor) {
          options.next_cursor = nextCursor;
        }

        console.log('Making API call with options:', options);
        const resources = await cloudinary.api.resources(options);
        allCloudinaryResources = allCloudinaryResources.concat(resources.resources);
        nextCursor = resources.next_cursor;
        
        console.log(`Fetched ${resources.resources.length} resources, total so far: ${allCloudinaryResources.length}`);
      } catch (apiError) {
        console.error('Error fetching resources from Cloudinary:', {
          name: apiError.name,
          message: apiError.message,
          code: apiError.http_code,
          error: apiError.error,
          stack: apiError.stack
        });
        throw apiError;
      }
    } while (nextCursor);

    const cloudinaryPublicIds = allCloudinaryResources.map((resource) => resource.public_id);
    console.log(`Total Cloudinary images in 'tickets' folder: ${cloudinaryPublicIds.length}`);

    if (cloudinaryPublicIds.length === 0) {
      console.log('No images found in Cloudinary tickets folder.');
      await mongoose.disconnect();
      return;
    }

    // Identify orphaned images
    const orphanedPublicIds = cloudinaryPublicIds.filter((publicId) => !usedPublicIds.has(publicId));
    console.log(`Orphaned images found: ${orphanedPublicIds.length}`);

    if (orphanedPublicIds.length > 0) {
      console.log('Orphaned publicIds:', orphanedPublicIds);
      
      // Ask for confirmation (in a real script, you might want to add a CLI prompt)
      console.log('Would delete these orphaned images from Cloudinary...');
      
      // Uncomment the next lines to actually delete (be careful!)
    
      const result = await cloudinary.api.delete_resources(orphanedPublicIds, {
        resource_type: 'image',
        invalidate: true,
      });
      console.log('Deleted orphaned images result:', result);
    
    } else {
      console.log('No orphaned images to delete. All Cloudinary images are referenced in the database.');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error during cleanup:', {
      name: error.name || 'Unknown',
      message: error.message || 'Unknown error',
      code: error.http_code || 'No HTTP code',
      error: error.error || 'No error details',
      stack: error.stack || 'No stack trace'
    });
    
    // Try to disconnect even if there was an error
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError.message);
    }
  }
};

// Run the cleanup
cleanupCloudinaryImages();