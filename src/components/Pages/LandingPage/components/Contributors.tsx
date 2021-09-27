import React from 'react';

export interface IDeveloperContributor {
  link: string;
  image: string;
  name: string;
  university: string;
  universityLink: string;
}
export interface IDeveloperSupervisor {
  link: string;
  image: string;
  name: string;
  university: string;
  universityLink: string;
  position: string;
}

export interface IContributorsProps {
  heading: string;
  developers: IDeveloperContributor[];
  supervisors: IDeveloperSupervisor[];
}

export const Contributors: React.FC<IContributorsProps> = ({ heading, developers, supervisors }) => {
  const mapDevelopers = () => {
    return developers.map((developer) => (
      <div key={developer.name} className='col-xl-3'>
        <div className='testimonial-item mx-auto mb-5 mb-xl-4'>
          <a href={`${developer.link}`} target='_blank' rel='noopener noreferrer'>
            <img className='img-fluid rounded-circle mb-3' src={`img/${developer.image}`} alt='' />
          </a>
          <h5>{developer.name}</h5>
          <p className='font-weight-light mb-0'>
            <strong>Developer</strong>
            <br />
            <a href={`${developer.universityLink}`} target='_blank' rel='noopener noreferrer'>
              {developer.university}
            </a>
          </p>
        </div>
      </div>
    ));
  };

  const mapSupervisors = () => {
    return supervisors.map((supervisor) => (
      <div key={supervisor.name} className='col-xl-3'>
        <div className='testimonial-item mx-auto mb-5 mb-xl-4'>
          <a href={`${supervisor.link}`}>
            <img className='img-fluid rounded-circle mb-3' src={`img/${supervisor.image}`} alt='' />
          </a>
          <h5>{supervisor.name}</h5>
          <p className='font-weight-light mb-0'>
            Project Supervisor <br />
            <strong style={{ fontWeight: 600 }}>
              {supervisor.position} <br />
              <a href={`${supervisor.universityLink}`} target='_blank' rel='noopener noreferrer'>
                {supervisor.university}
              </a>
            </strong>
          </p>
        </div>
      </div>
    ));
  };

  return (
    <section className='testimonials text-center bg-light'>
      <div className='container'>
        <h2 className='mb-5'>{heading}</h2>
        <div className='col-xs-12'>
          <div className='row'>{mapDevelopers()}</div>
        </div>
        <div className='col-xs-12'>
          <div className='row'>{mapSupervisors()}</div>
        </div>
      </div>
    </section>
  );
};
