import { Route, Switch } from 'react-router';
import { Layout } from './Layout/Layout';
import { Dashboard } from './Pages/Dashboard';
import { Home } from './Pages/Home';

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
