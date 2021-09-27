import { Route, Switch, useHistory } from 'react-router';
import { Layout } from './components/Layout/Layout';
import { Analysis } from './components/Pages/Analysis';
import { LandingPage } from './components/Pages/LandingPage/LandingPage';

const ANALYSIS_PATH = '/analysis';

export const Routes: React.FC = () => {
  const history = useHistory();

  return (
    <Switch>
      <Route path={ANALYSIS_PATH}>
        <Layout>
          <Analysis />
        </Layout>
      </Route>
      <Route path='/'>
        <LandingPage onNext={() => history.push(ANALYSIS_PATH)} />
      </Route>
    </Switch>
  );
};
