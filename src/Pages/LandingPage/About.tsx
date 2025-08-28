import React from 'react';
import { Contributors } from '../../components/Contributors';
import { MastHead } from '../../components/MastHead';
import data from './static/data.json';

export const About: React.FC = () => {
  return (
    <div>
      <MastHead />

      <Contributors
        heading={data.contributors.heading}
        developers={data.contributors.developers}
        supervisors={data.contributors.supervisors}
      />
    </div>
  );
};
