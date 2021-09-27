import React from 'react';
import { Contributors } from './components/Contributors';
import { MastHead } from './components/MastHead';
import data from './static/data.json';

export interface IAboutProps {
  onNext: (email: string) => void;
}

export const About: React.FC<IAboutProps> = ({ onNext }) => {
  return (
    <div>
      <MastHead onNext={onNext} />

      <Contributors heading={data.contributors.heading} developers={data.contributors.developers} supervisors={data.contributors.supervisors} />
    </div>
  );
};
