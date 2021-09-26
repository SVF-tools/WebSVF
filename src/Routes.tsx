import { Route, Switch } from 'react-router';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Pages/Dashboard';
import { Home } from './components/Pages/Home';

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path='/dashboard'>
        <Layout>
          <Dashboard />
        </Layout>
      </Route>
      <Route path='/'>
        <Home />
      </Route>
    </Switch>
  );
};
