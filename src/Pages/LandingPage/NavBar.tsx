import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  min-height: 10vh;

  #navbar {
    .btn-primary {
      margin-right: 1rem;
    }
  }

  #navbarNav {
    margin: auto;
    justify-content: flex-end;
  }
  .navbar-nav {
    color: #000000;
  }
  .nav-link {
    font-size: large;
  }
`;

export const NavBar: React.FC = () => {
  return (
    <Nav className="navbar navbar-expand-lg navbar-light primary-color">
      <div id="navbar" className="container">
        <Link className="navbar-brand" to="/" replace>
          <h1
            style={{
              fontWeight: 'bold',
              color: 'black',
              fontSize: '2em',
            }}
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
        </span>
      </div>
    </Nav>
  );
};
