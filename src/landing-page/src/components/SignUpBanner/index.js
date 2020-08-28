import React from 'react';

const SignUpBanner = ({ heading, placeholder, buttonText }) => {
  return (
    <section className="call-to-action text-white text-center">
      <div className="overlay"></div>
      <div className="container">
        <div className="row">
          <div className="col-xl-12 mx-auto">
            <h2 className="mb-4">{heading}</h2>
            <form>
              <button
                type="submit"
                onClick={() => (window.location.href = '#signupform')}
                style={{ maxWidth: '250px' }}
                className="btn btn-block btn-lg btn-primary mx-auto"
              >
                {buttonText}
              </button>
            </form>
          </div>
          <div className="col-md-10 col-lg-8 col-xl-3 mx-auto">
            {/* <form>
              <div className="form-row">
                <div className="col-12 col-md-9 mb-2 mb-md-0">
                  {/* <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder={`${placeholder}`}
                  /> 
                </div>
                <div className="col-12 col-md-3">
                  
                </div>
              </div>
            </form> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpBanner;
