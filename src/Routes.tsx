import { Routes as RRDRoutes, Route } from 'react-router-dom';
import { LandingPage } from './Pages/LandingPage/LandingPage';
import SixApp from './six/App';
import SixGraphsPage from './six/pages/graphs/graphsPage';
import React from 'react';

export const Routes: React.FC = () => {
  return (
    <RRDRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/6.0" element={<SixApp />}>
        <Route index element={<SixGraphsPage />} />
        <Route path="session/:sessionId" element={<SixGraphsPage />} />
      </Route>
    </RRDRoutes>
  );
};
