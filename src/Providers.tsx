import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export const Providers: React.FC = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};
