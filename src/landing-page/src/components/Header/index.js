import React, { useEffect } from 'react';

import { Link } from 'react-router-dom';
import { logout } from '../../helpers/auth';

import './Header.scss';

const Header = (props) => {
  useEffect(() => {
    switch (props.route) {
      case '/':
        props.setRoute('/');
        break;
      case '/profile':
        props.setRoute('/profile');
        break;
      case '/login':
        props.setRoute('/login');
        break;
      default:
        break;
    }
  });

  return (
    <nav
      id="nav"
      className="navbar navbar-expand-lg navbar-light primary-color"
    >
      <div id="navbar" className="container">
        <Link
          className="navbar-brand"
          to="/"
          replace
          onClick={() => props.setRoute('/')}
        >
          <h1
            style={{
              fontWeight: 'bold',
              color: 'black',
              fontSize: '2em',
              fontFamily: 'Electrolize',
            }}
            data="WebSVF"
          >
            WebSVF
          </h1>
        </Link>

        <span>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className={`nav-item ${props.route === '/' ? 'active' : ''}`}>
                <Link
                  className="nav-link"
                  to="/"
                  replace
                  onClick={() => props.setRoute('/')}
                >
                  About
                </Link>
              </li>

              {props.authenticated || (
                <li
                  className={`nav-item ${
                    props.route === '/login' ? 'active' : ''
                  }`}
                >
                  <Link
                    className="nav-link"
                    to="/login"
                    replace
                    onClick={() => props.setRoute('/login')}
                  >
                    Login
                  </Link>
                </li>
              )}
              {!props.authenticated || (
                <li
                  className={`nav-item ${
                    props.route === '/profile' ? 'active' : ''
                  }`}
                >
                  <Link
                    className="nav-link"
                    to="/profile"
                    onClick={() => props.setRoute('/profile')}
                    replace
                  >
                    Profile
                  </Link>
                </li>
              )}
              {!props.authenticated || (
                <li
                  className={`nav-item ${
                    props.route === '/login' ? 'active' : ''
                  }`}
                >
                  <Link
                    className="nav-link"
                    to="/login"
                    replace
                    onClick={() => {
                      props.setRoute('/login');
                      logout();
                    }}
                  >
                    Sign Out
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </span>
      </div>
    </nav>
  );
};

export default Header;
