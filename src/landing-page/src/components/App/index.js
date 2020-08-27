import React from 'react';

import './App.scss';

const App = () => {
  return (
    <div>
      {/*<!-- Navigation -->*/}
      <nav className="navbar navbar-light bg-light static-top">
        <div className="container">
          <a className="navbar-brand" href="#">
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

      {/*<!-- Masthead -->*/}
      <header id="header-top" className="masthead text-white text-center">
        <div className="overlay"></div>
        <div className="container">
          <div className="row">
            <div className="col-xl-12 mx-auto">
              <h1 className="mb-5 masthead-heading">
                <div className="title">Web-SVF:</div>
                Online Code Analysis Platform powered by
                <a className="link">SVF-Tools</a>
                <br />
                <br />
                Sign Up to stay updated on the latest develepments
              </h1>
            </div>
            <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
              <form id="signupform">
                <div className="form-row">
                  <div className="col-12 col-md-9 mb-2 mb-md-0">
                    <input
                      type="email"
                      id="header-email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email..."
                      required
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <button
                      type="submit"
                      className="btn btn-block btn-lg btn-primary"
                    >
                      Sign Up!
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div
              id="alertsignup"
              className="col-md-10 col-lg-8 col-xl-7 mx-auto"
            >
              <h2></h2>
              <div className="alert">
                <span
                  className="closebtn"
                  onClick={() => {
                    this.parentElement.style.display = 'none';
                  }}
                >
                  &times;
                </span>
                Email added to Mailing List. Please Use
                <a className="highlight">Password:</a>
                <a className="password">21G12T7Y14</a> to log into Web-SVF
              </div>
            </div>
          </div>
        </div>
      </header>

      {/*<!-- Carousel -->*/}

      <div
        id="myCarousel"
        className="carousel slide carousel-fade"
        data-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="mask flex-center">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-md-7 col-12 order-md-1 order-2">
                    <h4>
                      Code Anywhere <br />
                      with our Online Code Editor
                    </h4>
                    <p>
                      Our online code editor powered by VSCode Online allows you
                      to work on your projects anywhere. <br />
                      Hosted on scalable AWS Servers means you can compile and
                      computer faster than even your local machine.
                    </p>
                    <a
                      href="https://github.com/SVF-tools/WebSVF"
                      target="_blank"
                    >
                      <i className="fab fa-github fa-fw"></i>Find Out More
                    </a>
                  </div>
                  <div className="col-md-5 col-12 order-md-2 order-1">
                    <img
                      src="img/vscode_online_carousel.png"
                      className="mx-auto"
                      alt="slide"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="mask flex-center">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-md-7 col-12 order-md-1 order-2">
                    <h4>
                      Visualize Your Projects
                      <br />
                      as 3D Forced Graphs
                    </h4>
                    <p>
                      Dive into code analysis with ease using our React powered
                      3D Forced Graph Analysis <br />
                      Every file including external libraries are represented as
                      nodes clustered in groups following the project heirarchy
                    </p>
                    <a
                      href="https://github.com/SVF-tools/WebSVF"
                      target="_blank"
                    >
                      <i className="fab fa-github fa-fw"></i>Find Out More
                    </a>
                  </div>
                  <div className="col-md-5 col-12 order-md-2 order-1">
                    <img
                      src="img/Forced-Graph_carousel.png"
                      className="mx-auto"
                      alt="slide"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="mask flex-center">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-md-7 col-12 order-md-1 order-2">
                    <h4>
                      Deep Bug Search <br />
                      Using SVF's Code Analysis
                    </h4>
                    <p>
                      With the click of a button, analyse your entire project
                      for compile and runtime errors <br />
                      as well as highlight potential points of failure within
                      indvidual files
                    </p>
                    <a
                      href="https://github.com/SVF-tools/WebSVF"
                      target="_blank"
                    >
                      <i className="fab fa-github fa-fw"></i>Find Out More
                    </a>
                  </div>
                  <div className="col-md-5 col-12 order-md-2 order-1">
                    <img
                      src="img/bug_carousel_alt_2_480.png"
                      className="mx-auto"
                      alt="slide"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a
          className="carousel-control-prev"
          href="#myCarousel"
          role="button"
          data-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href="#myCarousel"
          role="button"
          data-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Next</span>
        </a>
      </div>

      {/*<!-- Icons Grid -->*/}
      <section className="features-icons bg-light text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-4">
                <div className="features-icons-icon d-flex">
                  <i className="far fa-file-code m-auto text-primary"></i>
                </div>
                <h3>C++ Project Support</h3>
                <p className="lead mb-0">
                  Upload you C++ project onto our online code editor and compile
                  and run it on our secured server
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-4">
                <div className="features-icons-icon d-flex">
                  <i className="fas fa-project-diagram m-auto text-primary"></i>
                </div>
                <h3>Visualize your Data in 3D</h3>
                <p className="lead mb-0">
                  In a single click Web-SVF can compile your project and
                  visualize as a 3D Forced graph with interacable nodes within
                  our editor
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="features-icons-item mx-auto mb-0 mb-lg-4">
                <div className="features-icons-icon d-flex">
                  <i className="fas fa-bug m-auto text-primary"></i>
                </div>
                <h3>Bug Analysis</h3>
                <p className="lead mb-0">
                  One click can analyse you project for bugs and potential
                  points of failure, highlighting them in the 3D forced graph as
                  well as generate a detailed Bug Report.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*<!-- Install Now Banner -->*/}

      <section className="install-banner">
        <div className="features-icons-icon d-flex">
          <i className="fas fa-server m-auto icon"></i>
        </div>
        <br />
        <h1>Setup your own local instance of</h1>
        <h1 className="highlight">Web-SVF</h1>
        <h2>in a few simple steps:</h2>
      </section>

      {/*<!-- Setup Guide (Youtube Showcases) -->*/}
      <section className="showcase">
        <div className="container-fluid p-0">
          <div className="row no-gutters">
            <div className="col-lg-5 order-lg-1 my-auto showcase-text">
              <div className="features-icons text-center">
                <div className="features-icons-item mx-auto">
                  <div className="features-icons-icon d-flex">
                    <i className="fab fa-ubuntu m-auto text-primary"></i>
                  </div>
                </div>
                <h2>Setup and Test WebSVF (Ubuntu 20.04)</h2>
                <p className="lead mb-0">
                  Get started with setting up WebSVF and using it with a sample
                  C Project.
                </p>
              </div>
            </div>
            <div className="col-lg-7 order-lg-2 text-white showcase-img embed-responsive embed-responsive-16by9">
              <iframe
                src="https://www.youtube.com/embed/ArzYCh7vOU0"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-lg-5 order-lg-2 my-auto showcase-text">
              <div className="features-icons text-center">
                <div className="features-icons-item mx-auto">
                  <div className="features-icons-icon d-flex">
                    <i className="fas fa-cogs m-auto text-primary"></i>
                  </div>
                </div>
                <h2>WebSVF-frontend User Guide</h2>
                <p className="lead mb-0">
                  An overview of the WebSVF-frontend and WebSVF-frontend-server
                  and how to use them to get started with WebSVF.
                </p>
              </div>
            </div>
            <div className="col-lg-7 order-lg-1 text-white showcase-img embed-responsive embed-responsive-16by9">
              <iframe
                src="https://www.youtube.com/embed/ybl9vLaBeE8"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-lg-5 order-lg-1 my-auto showcase-text">
              <div className="features-icons text-center">
                <div className="features-icons-item mx-auto">
                  <div className="features-icons-icon d-flex">
                    <i className="fas fa-laptop-code m-auto text-primary"></i>
                  </div>
                </div>
                <h2>WebSVF-codemap-extension User Guide</h2>
                <p className="lead mb-0">
                  A step by step guide taking you through the WebSVF's
                  codemap-extension and all of its features.
                </p>
              </div>
            </div>
            <div className="col-lg-7 order-lg-2 text-white showcase-img embed-responsive embed-responsive-16by9">
              <iframe
                src="https://www.youtube.com/embed/3f2VE1nvC0I"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/*<!-- Contributors (Testimonials) -->*/}
      <section className="testimonials text-center bg-light">
        <div className="container">
          <h2 className="mb-5">
            This project would not have been possible without our core
            contributors...
          </h2>
          <div className="row pb-3">
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-4">
                <a href="https://github.com/spcidealacm/" target="_blank">
                  <img
                    className="img-fluid rounded-circle mb-3"
                    src="img/Tianyang_Guan.jpg"
                    alt=""
                  />
                </a>
                <h5>Tianyang Guan</h5>
                <p className="font-weight-light mb-0">
                  <strong>Developer</strong>
                  <br />
                  <a href="https://www.uts.edu.au/" target="_blank">
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-4">
                <a href="https://github.com/akshatsinghkaushik" target="_blank">
                  <img
                    className="img-fluid rounded-circle mb-3"
                    src="img/Akshat_Kaushik.jpg"
                    alt=""
                  />
                </a>
                <h5>Akshat Kaushik</h5>
                <p className="font-weight-light mb-0">
                  <strong>Developer</strong>
                  <br />
                  <a href="https://www.uts.edu.au/" target="_blank">
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-0">
                <a href="https://github.com/ZichengQu" target="_blank">
                  <img
                    className="img-fluid rounded-circle mb-3"
                    src="img/Zicheng_Qu.jpg"
                    alt=""
                  />
                </a>
                <h5>Zicheng Qu</h5>
                <p className="font-weight-light mb-0">
                  <strong>Developer</strong>
                  <br />
                  <a href="https://www.uts.edu.au/" target="_blank">
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-0">
                <a href="https://github.com/JIACHENLIU09" target="_blank">
                  <img
                    className="img-fluid rounded-circle mb-3"
                    src="img/Jiachen_Liu.jpg"
                    alt=""
                  />
                </a>
                <h5>Jiachen Liu</h5>
                <p className="font-weight-light mb-0">
                  <strong>Developer</strong>
                  <br />
                  <a href="https://www.uts.edu.au/" target="_blank">
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="row pb-3">
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-4">
                <a href="https://github.com/sthprashant" target="_blank">
                  <img
                    className="img-fluid rounded-circle mb-3"
                    src="img/Prashant_Shrestha.jpg"
                    alt=""
                  />
                </a>
                <h5>Prashant Shrestha</h5>
                <p className="font-weight-light mb-0">
                  <strong>Developer</strong>
                  <br />
                  <a href="https://www.uts.edu.au/" target="_blank">
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-4">
                <a href="https://github.com/zexiliudai" target="_blank">
                  <img
                    className="img-fluid rounded-circle mb-3"
                    src="img/Lee.jpg"
                    alt=""
                  />
                </a>
                <h5>Lee</h5>
                <p className="font-weight-light mb-0">
                  <strong>Developer</strong>
                  <br />
                  <a href="https://www.uts.edu.au/" target="_blank">
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-0">
                <a href="https://github.com/winoooops" target="_blank">
                  <img
                    className="img-fluid rounded-circle mb-3"
                    src="img/Wei.jpg"
                    alt=""
                  />
                </a>
                <h5>Wei</h5>
                <p className="font-weight-light mb-0">
                  <strong>Developer</strong>
                  <br />
                  <a href="https://www.uts.edu.au/" target="_blank">
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-0">
                <a href="https://github.com/yukinsnow" target="_blank">
                  <img
                    className="img-fluid rounded-circle mb-3"
                    src="img/Zeren_Yu.jpg"
                    alt=""
                  />
                </a>
                <h5>Zeren Yu</h5>
                <p className="font-weight-light mb-0">
                  <strong>Developer</strong>
                  <br />
                  <a href="https://www.uts.edu.au/" target="_blank">
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6">
              <div className="testimonial-item mx-auto mb-5 mb-xl-0">
                <a href="http://helloqirun.github.io/" target="_blank">
                  <img
                    className="img-fluid rounded-circle mb-3"
                    src="img/Qirun-Zhang.jpg"
                    alt=""
                  />
                </a>
                <h5>Dr Qirun Zhang</h5>
                <p className="font-weight-light mb-0">
                  Project Supervisor <br />
                  <strong>
                    Assistant Professor
                    <br />
                    <a href="http://www.gatech.edu/" target="_blank">
                      Georgia Institute of Technology
                    </a>
                  </strong>
                </p>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="testimonial-item mx-auto mb-5 mb-xl-4">
                <a href="https://yuleisui.github.io/">
                  <img
                    className="img-fluid rounded-circle mb-3"
                    src="img/Yulei-Sui.jpg"
                    alt=""
                  />
                </a>
                <h5>Dr Yulei Sui</h5>
                <p className="font-weight-light mb-0">
                  Project Supervisor <br />
                  <strong>
                    Senior Lecturer <br />
                    <a href="https://www.uts.edu.au/" target="_blank">
                      University of Technology Sydney
                    </a>
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*<!-- Call to Action -->*/}
      <section className="call-to-action text-white text-center">
        <div className="overlay"></div>
        <div className="container">
          <div className="row">
            <div className="col-xl-9 mx-auto">
              <h2 className="mb-4">Ready to get started? Sign up now!</h2>
            </div>
            <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
              <form>
                <div className="form-row">
                  <div className="col-12 col-md-9 mb-2 mb-md-0">
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email..."
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <button
                      type="submit"
                      className="btn btn-block btn-lg btn-primary"
                    >
                      Sign up!
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/*<!-- Footer -->*/}
      <footer className="footer bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 h-100 text-center text-lg-left my-auto">
              <ul className="list-inline mb-2">
                <li className="list-inline-item">
                  <a href="#">About</a>
                </li>
                <li className="list-inline-item">&sdot;</li>
                <li className="list-inline-item">
                  <a href="#">Contact</a>
                </li>
                <li className="list-inline-item">&sdot;</li>
                <li className="list-inline-item">
                  <a href="#">Terms of Use</a>
                </li>
                <li className="list-inline-item">&sdot;</li>
                <li className="list-inline-item">
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>

              <p id="site-yr" className="text-muted small mb-4 mb-lg-0">
                &copy; SVF-Tools . All Rights Reserved.
              </p>
            </div>
            <div className="col-lg-6 h-100 text-center text-lg-right my-auto">
              <ul className="list-inline mb-0">
                <li className="list-inline-item mr-3">
                  <a href="#">
                    <i className="fas fa-cloud-upload-alt fa-2x fa-fw"></i>
                  </a>
                </li>

                <li className="list-inline-item mr-3">
                  <a href="https://github.com/SVF-tools/WebSVF" target="_blank">
                    <i className="fab fa-github fa-2x fa-fw"></i>
                  </a>
                </li>
                <li className="list-inline-item">
                  <a
                    href="https://github.com/SVF-tools/WebSVF/fork"
                    target="_blank"
                  >
                    <i className="fas fa-code-branch fa-2x fa-fw"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
