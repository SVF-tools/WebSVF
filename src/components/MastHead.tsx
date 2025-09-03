import React from 'react';
import './MastHead.css';

export const MastHead: React.FC = () => {
  return (
    <header id="header-top" className="masthead text-white text-center">
      <div className="container">
        <div className="row">
          <div className="col-xl-12 mx-auto">
            <h1 className="mb-5 masthead-heading">
              <div className="title">WebSVF:</div>
              Online Learning and Visualization Platform for Code Analysis
              <br /> <br />
              powered by
              <br />
              <a
                className="link"
                href="https://github.com/SVF-tools/SVF"
                target="_blank"
                rel="noopener noreferrer"
              >
                SVF-Tools
              </a>
            </h1>
          </div>
          <div className="col-xl-12 d-flex flex-column align-items-center">
            <div className="d-flex justify-content-center flex-wrap">
              <a className="btn btn-lg btn-primary m-2" href="/6.0">
                Try WebSVF 6.0 now!
              </a>

              <a
                className="btn btn-lg btn-outline-light m-2"
                href="https://github.com/SVF-tools/WebSVF"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-github"></i>
                Contribute on GitHub
              </a>
            </div>

            <div className="dropdown mt-2 text-center">
              <button
                className="btn btn-sm btn-outline-light dropdown-toggle btn-compact"
                type="button"
                id="prevVersionsDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                See previous versions
              </button>
              <ul className="dropdown-menu" aria-labelledby="prevVersionsDropdown">
                <li>
                  <a
                    className="dropdown-item"
                    href="https://websvf.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WebSVF 5.0
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
