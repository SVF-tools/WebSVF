import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { router } from './Routes/Routes';
import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);
