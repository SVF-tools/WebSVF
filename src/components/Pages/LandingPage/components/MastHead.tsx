import React, { useState } from 'react';

export interface IMastHeadProps {
  onNext: (email: string) => void;
}

export const MastHead: React.FC<IMastHeadProps> = ({ onNext }) => {
  const [email, setEmail] = useState('');

  return (
    <header id='header-top' className='masthead text-white text-center'>
      <div className='container'>
        <div className='row'>
          <div className='col-xl-12 mx-auto'>
            <h1 className='mb-5 masthead-heading'>
              <div className='title'>WebSVF:</div>
              Online Learning and Teaching Platform for Code Analysis
              <br /> <br />
              powered by
              <br />
              <a className='link' href='https://github.com/SVF-tools/SVF' target='_blank' rel='noopener noreferrer'>
                SVF-Tools
              </a>
              <br />
              <br />
              Enter your email to try our demo page
            </h1>
          </div>
          <div className='col-xl-12 d-flex justify-content-center'>
              <div>
                <input
                  type='email'
                  className='form-control form-control-lg'
                  placeholder='Enter your email...'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='col-12 col-md-3'>
                <button type='submit' className='btn btn-block btn-lg btn-primary' onClick={() => onNext(email)} disabled={!!email}>
                  Try WebSVF 2.0 now!
                </button>
              </div>
              <div className='col-12 col-md-3'>
                <a type='submit' className='btn btn-block btn-lg btn-primary' href="http://35.165.134.143/">
                  Try WebSVF 3.0 now!
                </a>
              </div>
          </div>
        </div>
      </div>
    </header>
  );
};
