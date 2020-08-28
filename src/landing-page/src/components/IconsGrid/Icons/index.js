import React from 'react';

const Icons = ({ heading, icon, content }) => {
  return (
    <div className="col-lg-4">
      <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-4">
        <div className="features-icons-icon d-flex">
          <i className={`${icon} m-auto text-primary`}></i>
        </div>
        <h3>{heading}</h3>
        <p className="lead mb-0">{content}</p>
      </div>
    </div>
  );
};

export default Icons;
