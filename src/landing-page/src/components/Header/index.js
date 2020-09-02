import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { logout } from '../../helpers/auth';

import './Header.scss';

const Header = (props) => {
  const [active, setActive] = useState('About');
  return (
    <nav
      id="nav"
      className="navbar navbar-expand-lg navbar-light primary-color"
    >
      <div id="navbar" className="container">
        <a className="navbar-brand" href="#navbar">
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
        </a>

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
              <li className={`nav-item ${active === 'About' ? 'active' : ''}`}>
                <Link
                  className="nav-link"
                  to="/"
                  replace
                  onClick={() => setActive('About')}
                >
                  About
                  {/* <span className="sr-only">(current)</span> */}
                </Link>
              </li>
              {/* <li class="nav-item">
                <Link class="nav-link" to="/">
                  Features
                </Link>
              </li> */}
              {props.authenticated || (
                <li
                  className={`nav-item ${active === 'Login' ? 'active' : ''}`}
                >
                  <Link
                    className="nav-link"
                    to="/login"
                    replace
                    onClick={() => setActive('Login')}
                  >
                    Login
                  </Link>
                </li>
              )}
              {!props.authenticated || (
                <li
                  className={`nav-item ${active === 'Profile' ? 'active' : ''}`}
                >
                  <Link
                    className="nav-link"
                    to="/profile"
                    replace
                    onClick={() => setActive('Profile')}
                  >
                    Profile
                  </Link>
                </li>
              )}
              {!props.authenticated || (
                <li
                  className={`nav-item ${
                    active === 'Sign Out' ? 'active' : ''
                  }`}
                >
                  <Link
                    className="nav-link"
                    to="/login"
                    replace
                    onClick={() => {
                      setActive('Sign Out');
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
