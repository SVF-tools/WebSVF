import React from 'react';

import './App.scss';

import Header from '../Header';
import MastHead from '../MastHead';
import CarouselContainer from '../Carousel/CarouselContainer';
import CarouselItem from '../Carousel/CarouselItem';

import staticData from '../../staticData.json';

const App = () => {
  const mapCarouselItems = () =>
    staticData.carousel.map((item) => {
      return (
        <CarouselItem
          heading={item.heading}
          subHeading={item.subHeading}
          desc={item.description}
          extDesc={item.extendedDescription}
          image={item.image}
          active={item.active}
        />
      );
    });

  return (
    <div>
      <Header />

      <MastHead
        link={staticData.demo.link}
        password={staticData.demo.password}
      />

      <CarouselContainer>{mapCarouselItems()}</CarouselContainer>

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
                <h2>Setup and Test WebSVF</h2>
                <p className="lead mb-0">
                  Get started with setting up WebSVF and using it with a sample
                  C Project.
                </p>
              </div>
            </div>
            <div className="col-lg-7 order-lg-2 text-white showcase-img embed-responsive embed-responsive-16by9">
              <iframe
                title="Setup and Test WebSVF"
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
                title="WebSVF-frontend User Guide"
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
                title="WebSVF-codemap-extension User Guide"
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
                <a
                  href="https://github.com/spcidealacm/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                  <a
                    href="https://www.uts.edu.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-4">
                <a
                  href="https://github.com/akshatsinghkaushik"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                  <a
                    href="https://www.uts.edu.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-0">
                <a
                  href="https://github.com/ZichengQu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                  <a
                    href="https://www.uts.edu.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-0">
                <a
                  href="https://github.com/JIACHENLIU09"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                  <a
                    href="https://www.uts.edu.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="row pb-3">
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-4">
                <a
                  href="https://github.com/sthprashant"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                  <a
                    href="https://www.uts.edu.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-4">
                <a
                  href="https://github.com/zexiliudai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                  <a
                    href="https://www.uts.edu.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-0">
                <a
                  href="https://github.com/winoooops"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                  <a
                    href="https://www.uts.edu.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="testimonial-item mx-auto mb-5 mb-xl-0">
                <a
                  href="https://github.com/yukinsnow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                  <a
                    href="https://www.uts.edu.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    University of Technology Sydney
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6">
              <div className="testimonial-item mx-auto mb-5 mb-xl-0">
                <a
                  href="http://helloqirun.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                    <a
                      href="http://www.gatech.edu/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
                    <a
                      href="https://www.uts.edu.au/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
                  <a href="#navbar">About</a>
                </li>
                <li className="list-inline-item">&sdot;</li>
                <li className="list-inline-item">
                  <a href="#navbar">Contact</a>
                </li>
                <li className="list-inline-item">&sdot;</li>
                <li className="list-inline-item">
                  <a href="#navbar">Terms of Use</a>
                </li>
                <li className="list-inline-item">&sdot;</li>
                <li className="list-inline-item">
                  <a href="#navbar">Privacy Policy</a>
                </li>
              </ul>

              <p id="site-yr" className="text-muted small mb-4 mb-lg-0">
                &copy; SVF-Tools . All Rights Reserved.
              </p>
            </div>
            <div className="col-lg-6 h-100 text-center text-lg-right my-auto">
              <ul className="list-inline mb-0">
                <li className="list-inline-item mr-3">
                  <a href="#navbar">
                    <i className="fas fa-cloud-upload-alt fa-2x fa-fw"></i>
                  </a>
                </li>

                <li className="list-inline-item mr-3">
                  <a
                    href="https://github.com/SVF-tools/WebSVF"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-github fa-2x fa-fw"></i>
                  </a>
                </li>
                <li className="list-inline-item">
                  <a
                    href="https://github.com/SVF-tools/WebSVF/fork"
                    target="_blank"
                    rel="noopener noreferrer"
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
