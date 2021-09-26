import React from 'react';
import { Providers } from './Providers';
import { Routes } from './Routes';

export const App: React.FC = () => {
  return (
    <Providers>
      <Routes />
    </Providers>
  );
};
