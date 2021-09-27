import React from 'react';
import styled from 'styled-components';
import { NavBar } from './NavBar';
import './LandingPage.css';
import { About } from './About';

const Container = styled.div`
  .masthead-heading {
    font-weight: bold;
    font-size: 2.5em !important;
    color: #dadada !important;

    .title {
      font-weight: bold;
      color: #4b75ff;
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

export interface ILandingPageProps {
  onNext: (email: string) => void;
}

export const LandingPage: React.FC<ILandingPageProps> = ({ onNext }) => {
  return (
    <Container>
      <NavBar />
      <About onNext={onNext} />
    </Container>
  );
};
