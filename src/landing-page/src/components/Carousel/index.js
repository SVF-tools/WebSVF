import React from 'react';

import CarouselContainer from '../Carousel/CarouselContainer';
import CarouselItem from '../Carousel/CarouselItem';

import './carousel.scss';

const Carousel = ({ carousel }) => {
  const mapCarouselItems = () =>
    carousel.map((item, index) => {
      return (
        <CarouselItem
          key={index}
          heading={item.heading}
          subHeading={item.subHeading}
          desc={item.description}
          extDesc={item.extendedDescription}
          image={item.image}
          active={item.active}
        />
      );
    });

  return <CarouselContainer>{mapCarouselItems()}</CarouselContainer>;
};

export default Carousel;
