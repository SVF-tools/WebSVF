import React from 'react';

const CarouselContainer = ({ children }) => {
  /* The code for carousel slide transition is written using jquery
      and can be found in the public/js/carousel.js file */

  return (
    <div
      id="myCarousel"
      className="carousel slide carousel-fade"
      data-ride="carousel"
    >
      <div className="carousel-inner">{children}</div>

      <a
        className="carousel-control-prev"
        href="#myCarousel"
        role="button"
        data-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
      </a>
      <a
        className="carousel-control-next"
        href="#myCarousel"
        role="button"
        data-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
      </a>
    </div>
  );
};

export default CarouselContainer;
