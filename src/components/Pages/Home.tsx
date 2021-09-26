import React from 'react';
import styled from 'styled-components';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from './LandingPage/NavBar';

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
