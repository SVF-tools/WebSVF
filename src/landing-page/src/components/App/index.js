import React, { useEffect, useState } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  //Redirect,
} from 'react-router-dom';

import About from '../Pages/About';
import Login from '../Pages/Login';
import Profile from '../Pages/Profile';

import Header from '../Header';

import './App.scss';

import { auth } from '../../services/firebase';

const App = (props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
        setLoading(false);
      } else {
        setAuthenticated(false);
        setLoading(false);
      }
    });
  }, []);

  return loading === true ? (
    <div
      className="spinner-border text-success"
      role="status"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
      }}
    >
      <span className="sr-only">Loading...</span>
    </div>
  ) : (
    <div>
      <Router basename="/">
        <Header authenticated={authenticated} />
        <Switch>
          <Route exact path="/">
            <About />
          </Route>
          {authenticated || (
            <Route exact path="/login">
              <Login />
            </Route>
          )}
          {!authenticated || (
            <Route exact path="/profile">
              <Profile />
            </Route>
          )}
        </Switch>
      </Router>
    </div>
  );
};

export default App;
