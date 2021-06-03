import React from 'react';
import { Layout } from './Layout/Layout';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { Home } from './Pages/Home';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Layout>
        <Home />
      </Layout>
    </Provider>
  );
};
