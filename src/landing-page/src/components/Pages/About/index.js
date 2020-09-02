import React from 'react';

import MastHead from '../../MastHead';
import IconsGrid from '../../IconsGrid';
import Carousel from '../../Carousel';
import InstallBanner from '../../InstallBanner';
import VideoShowcase from '../../VideoShowcase';
import Contributors from '../../Contributors';
import SignUpBanner from '../../SignUpBanner';

import staticData from '../../../staticData.json';

const About = () => {
  return (
    <div>
      <MastHead
        link={staticData.demo.link}
        password={staticData.demo.password}
      />

      <Carousel carousel={staticData.carousel} />

      <IconsGrid icons={staticData.icons} />

      <InstallBanner
        callToAction={staticData['install-banner'].callToAction}
        subHeading={staticData['install-banner'].subHeading}
      />

      <VideoShowcase videos={staticData.videos} />

      <Contributors contributors={staticData.contributors} />

      <SignUpBanner
        heading={staticData.signUpBanner.heading}
        placeholder={staticData.signUpBanner.placeholder}
        buttonText={staticData.signUpBanner.buttonText}
      />
    </div>
  );
};

export default About;
