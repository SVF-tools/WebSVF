import React from 'react';

import TextColumn from './TextColumn';
import Video from './Video';

const VideoShowcase = ({ videos }) => {
  const mapVideos = () => {
    return videos.map((video, index) => {
      if (index % 2 === 0) {
        return (
          <div key={index} className="row no-gutters">
            <TextColumn
              title={video.title}
              desc={video.description}
              order={1}
              icon={video.icon}
            />
            <Video title={video.title} link={video['youtube-link']} order={2} />
          </div>
        );
      } else {
        return (
          <div key={index} className="row no-gutters">
            <TextColumn
              title={video.title}
              desc={video.description}
              order={2}
              icon={video.icon}
            />
            <Video title={video.title} link={video['youtube-link']} order={1} />
          </div>
        );
      }
    });
  };

  return (
    <section className="showcase">
      <div className="container-fluid p-0">{mapVideos()}</div>
    </section>
  );
};

export default VideoShowcase;
