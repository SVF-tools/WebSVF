import React from 'react';

const Header = () => {
  return (
    <nav className="navbar navbar-light bg-light static-top">
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
            Web-SVF
          </h1>
        </a>
        <a className="btn btn-primary" href="#header-top">
          Sign Up
        </a>
      </div>
    </nav>
  );
};

export default Header;
