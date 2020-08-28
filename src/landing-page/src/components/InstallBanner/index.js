import React from 'react';

import './installbanner.scss';

const InstallBanner = ({ callToAction, subHeading }) => {
  return (
    <section className="install-banner">
      <div className="features-icons-icon d-flex">
        <i className="fas fa-server m-auto icon"></i>
      </div>
      <br />
      <h1>{callToAction}</h1>
      <h1 className="highlight">Web-SVF</h1>
      <h2>{subHeading}</h2>
    </section>
  );
};

export default InstallBanner;
