import React from 'react';

const CarouselItem = ({
  heading,
  subHeading,
  desc,
  extDesc,
  image,
  active,
}) => {
  return (
    <div className={`carousel-item ${active}`}>
      <div className="mask flex-center">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-7 col-12 order-md-1 order-2">
              <h4>
                {heading} <br />
                {subHeading}
              </h4>
              <p>
                {desc} <br />
                {extDesc}
              </p>
              <a
                href="https://github.com/SVF-tools/WebSVF"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-github fa-fw"></i>Find Out More
              </a>
            </div>
            <div className="col-md-5 col-12 order-md-2 order-1">
              <img src={`img/${image}`} className="mx-auto" alt="slide" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;
