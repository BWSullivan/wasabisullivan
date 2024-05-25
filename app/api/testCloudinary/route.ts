import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log('Cloudinary Config:', {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET, 
// });

export async function GET() {
    try {
      const result = await cloudinary.api.resources({ max_results: 1 });
      console.log('Cloudinary test result:', result);
      return NextResponse.json({ message: 'Cloudinary is working', result });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Cloudinary test error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      } else {
        console.error('Unknown error:', error);
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
      }
    }
  }