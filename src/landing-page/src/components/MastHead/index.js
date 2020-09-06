import React, { useEffect, useRef } from 'react';

//import * as firebase from 'firebase/app';
//import 'firebase/auth';
//import 'firebase/database';
import { db } from '../../services/firebase';

import './sign-up.scss';

const MastHead = ({ link, password }) => {
  const signUpForm = useRef();
  const alertSignUp = useRef();

  useEffect(() => {
    // Initialize Firebase
    //firebase.initializeApp(firebaseConfig);

    // Reference signup-email collection
    var messagesRef = db.ref('signup-email');

    // Listen for form submit
    signUpForm.current.addEventListener('submit', submitForm);

    function submitForm(e) {
      e.preventDefault();

      // Get EmailID
      var email = getInputVal('header-email');

      // Save message
      saveMessage(email);

      // Clear form
      signUpForm.current.reset();

      // Show alert
      alertSignUp.current.style.display = 'block';

      var delayInMilliseconds = 5000; //5 seconds

      setTimeout(() => {
        window.open(link, '_blank');
      }, delayInMilliseconds);

      //'https://websvf.top/'

      // Hide alert after 15 seconds
      setTimeout(() => {
        alertSignUp.current.style.display = 'none';
      }, 30000); //30 Seconds

      return () => {
        signUpForm.current.removeEventListener('submit', submitForm);
      };
    }

    // Function to get get form values
    function getInputVal(id) {
      return document.getElementById(id).value;
    }

    // Save message to firebase
    function saveMessage(email) {
      var newMessageRef = messagesRef.push();
      newMessageRef.set({
        email: email,
      });
    }
  }, [link]);

  return (
    <header id="header-top" className="masthead text-white text-center">
      <div className="overlay"></div>
      <div className="container">
        <div className="row">
          <div className="col-xl-12 mx-auto">
            <h1 className="mb-5 masthead-heading">
              <div className="title">WebSVF:</div>
              Online Learning and Teaching Platform for Code Analysis 
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
              <br />
              <br />
              Sign Up to stay updated on the latest develepments
            </h1>
          </div>
          <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
            <form id="signupform" ref={signUpForm}>
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
            ref={alertSignUp}
            className="col-md-10 col-lg-8 col-xl-7 mx-auto"
          >
            <div className="alert mt-1">
              <span
                className="closebtn"
                onClick={() => {
                  alertSignUp.current.style.display = 'none';
                }}
              >
                &times;
              </span>
              <br />
              <p>Email added to Mailing List.</p>
              <p>
                Demo website is opening in a new tab...
                <br />
                If the demo page does not open automatically after 5 seconds,{' '}
                <a href={link} target="_blank" rel="noopener noreferrer">
                  click here
                </a>
              </p>

              <p className="highlight">Password:</p>
              <p className="password">{password}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MastHead;
