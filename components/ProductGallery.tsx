"use client";

import Image from "next/image";
import { useState } from "react";

export interface ProductGalleryProps {
  shirtId: string;
  images: string[];
  initialVariantIndex?: number;
  className?: string;
}


const ProductGallery = ({
    shirtId: _shirtId,
    initialVariantIndex: _initialVariantIndex,
    images,
    className = "",
}: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className={`flex w-full flex-col gap-4 lg:flex-row ${className}`}>
      <div className="order-2 flex gap-3 overflow-x-hidden lg:order-1 lg:flex-col p-2">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            aria-label={`Thumbnail ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`relative h-16 w-16 overflow-hidden rounded-lg ${index === activeIndex ? "border border-dark-900" : ""}`}
          >
            <Image src={`/${image}`} alt={`Thumbnail ${index + 1}`} fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="order-1 relative w-full h-[500px] overflow-hidden rounded-xl bg-light-200 lg:order-2">
        <Image src={`/${images[activeIndex]}`} alt="Shirt Image" fill className="object-contain group-hover:scale-105 transition-transform duration-300 ease-in-out" />
      </div>
       
      </div>
  )
}

export default ProductGallery