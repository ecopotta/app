import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../../Context'
import "./carousel.css"
function Carousel() {
    const { banners } = useAppContext()
const [currentIndex, setCurrentIndex] = useState(0);

const goToNextSlide = () => {
  setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % banners.length  
  );
}

const goToPrevSlide = () => {
  setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + banners.length) % banners.length 
  );
};

useEffect(() => {
  const interval = setInterval(goToNextSlide, 5000); 


  return () => clearInterval(interval);
}, [banners.length]);

return (
  <div className="carousel">
    <div
      className="carousel-container"
      style={{ transform: `translateX(-${currentIndex * 100}%)` }}
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className="slide"
        >
          <img src={banner.image_urls} alt={`Banner ${index + 1}`} />
        </div>
      ))}
    </div>
    <button className="prev" onClick={goToPrevSlide}>
      &#10094;
    </button>
    <button className="next" onClick={goToNextSlide}>
      &#10095;
    </button>
  </div>
);
}


export default Carousel