"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';

type CloudinaryImage = {
  src: string;
  alt: string;
  thumbnail: string;
};

const Japan: React.FC = () => {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/getImages');
        const data = await response.json();
        if (response.ok) {
          setImages(data);
        } else {
          console.error('Error fetching images:', data.error);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  // const isMobile = () => {
  //   if (typeof(window) !== undefined) {
  //     return window.innerWidth <= 700;
  //   }
  //   return false;
  // }

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 className="text-med text-zinc-500">
        Full resolution images (when downloaded), free for personal use.
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {images.map((image, index) => (
          <div key={index} style={{ margin: '1rem'}} onClick={() => { setIsOpen(true); setPhotoIndex(index); }}>
            <Image
              src={image.thumbnail}
              alt={image.alt}
              width="400" // size of display
              height="300"
              loading="lazy"
              style={{ cursor: 'pointer', borderRadius: '1rem' }}
            />
          </div>
        ))}
      </div>

      {isOpen && (
        <Lightbox // User clicks on the lightbox component and it loads the full res image
        // This is when phones crash, need to maybe lower the resolution?
          plugins={[Zoom, Fullscreen, Download]}
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={images.map(image => ({src: `https://res.cloudinary.com/da74xkmid/image/upload/${image.src}`, alt: image.alt }))}
          index={photoIndex}
        />
      )}
    </div>
  );
}

export default Japan;
