import React, { useState, useEffect } from "react";

const images = [
  { src: "/images/barangay.jpg", alt: "Barangay community scene" },

];

const SLIDE_INTERVAL = 5000;

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      {images.map((img, index) => (
        <img
          key={index}
          src={img.src}
          alt={img.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out 
            ${index === currentIndex ? "opacity-100" : "opacity-0"}
          `}
        />
      ))}
    </div>
  );
}
