import React from 'react';

const Footer = ({ navigation, icons }) => {
  const mapNavigation = () => {
    return navigation.map((nav, index) => {
      if (index !== 0) {
        return (
          <React.Fragment key={index}>
            <li className="list-inline-item">&sdot;</li>
            <li className="list-inline-item">
              <a href={`${nav.link}`}>{nav.title}</a>
            </li>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={index}>
            <li className="list-inline-item">
              <a href={`${nav.link}`}>{nav.title}</a>
            </li>
          </React.Fragment>
        );
      }
    });
  };

  const mapIcons = () => {
    return icons.map((icon, index) => {
      return (
        <li key={index} className="list-inline-item mr-3">
          <a href={`${icon.link}`} target="_blank" rel="noopener noreferrer">
            <i className={`${icon.icon} fa-2x fa-fw`}></i>
          </a>
        </li>
      );
    });
  };

  return (
    <footer className="footer bg-light">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 h-100 text-center text-lg-left my-auto">
            <ul className="list-inline mb-2">{mapNavigation()}</ul>

            <p id="site-yr" className="text-muted small mb-4 mb-lg-0">
              &copy;
              {` SVF-Tools ${new Date().getFullYear()}. All Rights Reserved.`}
            </p>
          </div>
          <div className="col-lg-6 h-100 text-center text-lg-right my-auto">
            <ul className="list-inline mb-0">{mapIcons()}</ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
