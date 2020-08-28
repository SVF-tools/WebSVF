import React from 'react';

const Video = ({ title, link, order }) => {
  return (
    <div
      className={`col-lg-7 order-lg-${order} text-white showcase-img embed-responsive embed-responsive-16by9`}
    >
      <iframe
        title={title}
        src={link}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Video;
