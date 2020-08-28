import React from 'react';

const TextColumn = ({ heading, desc, order, icon }) => {
  return (
    <div className={`col-lg-5 order-lg-${order} my-auto showcase-text`}>
      <div className="features-icons text-center">
        <div className="features-icons-item mx-auto">
          <div className="features-icons-icon d-flex">
            <i className={`${icon} m-auto text-primary`}></i>
          </div>
        </div>
        <h2>{heading}</h2>
        <p className="lead mb-0">{desc}</p>
      </div>
    </div>
  );
};

export default TextColumn;
