import { Routes as RRDRoutes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Analysis } from './components/Pages/Analysis';
import { LandingPage } from './components/Pages/LandingPage/LandingPage';
import SixApp from './six/App';
import SixGraphsPage from './six/pages/graphs/graphsPage';
import React from 'react';

const ANALYSIS_PATH = '/analysis';

export const Routes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <RRDRoutes>
      <Route
        path={ANALYSIS_PATH}
        element={
          <Layout>
            <Analysis />
          </Layout>
        }
      />
      <Route path="/" element={<LandingPage onNext={() => navigate(ANALYSIS_PATH)} />} />
      {/* Mount 6.0 app under /WebSVF/6.0/* */}
      <Route path="/WebSVF/6.0/*" element={<SixRouter />} />
    </RRDRoutes>
  );
};

// Define a thin wrapper to render the 6.0 app routes
const SixRouter: React.FC = () => {
  // We simulate the v6 createHashRouter tree with nested routes below
  return (
    <RRDRoutes>
      <Route path="/WebSVF/6.0/" element={<SixApp />}>
        <Route index element={<SixGraphsPage />} />
        <Route path="session/:sessionId" element={<SixGraphsPage />} />
      </Route>
    </RRDRoutes>
  );
};
