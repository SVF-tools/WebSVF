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

const NavBar: React.FC = () => {
  return (
    <Nav className='navbar navbar-expand-lg navbar-light primary-color'>
      <div id='navbar' className='container'>
        <Link className='navbar-brand' to='/' replace>
          <h1
            style={{
              fontWeight: 'bold',
              color: 'black',
              fontSize: '2em',
              fontFamily: 'Electrolize'
            }}>
            WebSVF
          </h1>
        </Link>

        <span>
          <button
            className='navbar-toggler'
            type='button'
            data-toggle='collapse'
            data-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarNav'>
            <ul className='navbar-nav'>
              <li>
                <Link className='nav-link' to='/' replace>
                  About
                </Link>
              </li>

              <li className={`nav-item`}>
                <Link className='nav-link' to='/login' replace>
                  Sign Out
                </Link>
              </li>
            </ul>
          </div>
        </span>
      </div>
    </Nav>
  );
};

const HomeContainer = styled.div`
  .masthead-heading {
    font-weight: bold;
    font-family: 'Inconsolata' !important;
    font-size: 2.5em !important;
    color: #dadada !important;

    .title {
      font-weight: bold;
      color: #4b75ff;
      font-family: 'Electrolize';
      font-size: 2.5em;
    }

    .link {
      color: #fff;
      font-weight: bold;
      text-decoration: underline;
    }
  }

  #alertsignup {
    .highlight {
      text-decoration: underline;
    }

    .password {
      font-weight: bold;
      color: black;
    }
  }
`;

export const Home: React.FC = () => {
  return (
    <HomeContainer>
      <NavBar />
    </HomeContainer>
  );
};
