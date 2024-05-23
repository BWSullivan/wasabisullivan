"use client"

import React, { useState, useEffect } from 'react';
import { CldImage } from 'next-cloudinary';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

type CloudinaryImage = {
  src: string;
  alt: string;
};

const Japan = () => {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/getImages');
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
        <h2 className="text-med text-zinc-500 ">
          Full resolution images, free for personal use.
        </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' , justifyContent: 'center'}}>
        {images.map((image, index) => (
          <div key={index} style={{ margin: '10px' }} onClick={() => { setIsOpen(true); setPhotoIndex(index); }}>
            <CldImage
              width="400"
              height="300"
              src={image.src}
              crop="fill"
              sizes="100vw"
              alt={image.alt}
            />
          </div>
        ))}
      </div>

      {isOpen && (
        <Lightbox
          plugins={[Zoom, Fullscreen, Download]}
          
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={images.map(image => ({ src: `https://res.cloudinary.com/da74xkmid/image/upload/v1714852545/${image.src}`, alt: image.alt }))}
          index={photoIndex}
        />
      )}
    </div>
  );
}

export default Japan;
