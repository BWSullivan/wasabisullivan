// app/api/getImages/route.ts

import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryImage = {
  src: string;
  alt: string;
};

export async function GET() {
  try {
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'Japan2023', // Replace with your folder name
      max_results: 300, // Adjust as needed
    });

    const images: CloudinaryImage[] = resources.map((resource: any) => ({
      src: resource.public_id,
      alt: resource.public_id.split('/').pop(), // Use the file name as alt text
    }));

    return NextResponse.json(images);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}