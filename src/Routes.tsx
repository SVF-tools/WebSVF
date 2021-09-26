import { Route, Switch } from 'react-router';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Pages/Dashboard';
import { LandingPage } from './components/Pages/LandingPage/LandingPage';

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path='/dashboard'>
        <Layout>
          <Dashboard />
        </Layout>
      </Route>
      <Route path='/'>
        <LandingPage />
      </Route>
    </Switch>
  );
};
