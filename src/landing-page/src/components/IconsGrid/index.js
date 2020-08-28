import React from 'react';

import Icons from './Icons';

const IconsGrid = ({ icons }) => {
  const mapIcons = () => {
    return icons.map((icon) => {
      return (
        <Icons
          key={icon.heading}
          heading={icon.heading}
          icon={icon.icon}
          content={icon.content}
        />
      );
    });
  };

  return (
    <section className="features-icons bg-light text-center">
      <div className="container">
        <div className="row">{mapIcons()}</div>
      </div>
    </section>
  );
};

export default IconsGrid;
