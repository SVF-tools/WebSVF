import React, { useEffect, useState } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import About from '../Pages/About';
import Login from '../Pages/Login';
import Profile from '../Pages/Profile';

import Header from '../Header';

import './App.scss';

import { auth } from '../../services/firebase';

// const PublicRoute = ({ component: Component, authenticated, ...rest }) => {
//   return <Route {...rest} render={(props) => <Component {...props} />} />;
// };

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
};

const App = (props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState('/');

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
  });

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
        <Header
          authenticated={authenticated}
          route={route}
          setRoute={setRoute}
        />
        <Switch>
          {/* <Route exact path="/">
            <About />
          </Route> */}
          <Route path="/" exact>
            <About authenticated={authenticated} />
          </Route>
          <PrivateRoute
            path="/profile"
            exact
            authenticated={authenticated}
            component={Profile}
          />
          <Route path="/login" exact>
            <Login setRoute={setRoute} authenticated={authenticated} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
