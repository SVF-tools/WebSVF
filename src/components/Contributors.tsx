import React from 'react';
import './Contributors.css';

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

export const Contributors: React.FC<IContributorsProps> = ({
  heading,
  developers,
  supervisors,
}) => {
  const mapDevelopers = () => {
    return developers.map((developer) => (
      <div
        key={developer.name}
        className="col-xl-3 col-lg-4 col-md-6 d-flex justify-content-center"
      >
        <div className="testimonial-item mx-auto mb-5 mb-xl-4 text-center">
          <a href={`${developer.link}`} target="_blank" rel="noopener noreferrer">
            <img className="img-fluid rounded-circle mb-3" src={`img/${developer.image}`} alt="" />
          </a>
          <h3 className="contributor-name">{developer.name}</h3>
          <p className="mb-0">
            <strong className="contributor-role">Developer</strong>
            <a
              href={`${developer.universityLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contributor-university-link"
            >
              {developer.university}
            </a>
          </p>
        </div>
      </div>
    ));
  };

  const mapSupervisors = () => {
    return supervisors.map((supervisor) => (
      <div
        key={supervisor.name}
        className="col-xl-3 col-lg-4 col-md-6 d-flex justify-content-center"
      >
        <div className="testimonial-item mx-auto mb-5 mb-xl-4 text-center">
          <a href={`${supervisor.link}`}>
            <img className="img-fluid rounded-circle mb-3" src={`img/${supervisor.image}`} alt="" />
          </a>
          <h3 className="contributor-name">{supervisor.name}</h3>
          <p className="mb-0">
            <strong className="contributor-role">Project Supervisor</strong>
            <span style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>
              {supervisor.position}
            </span>
            <a
              href={`${supervisor.universityLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contributor-university-link"
            >
              {supervisor.university}
            </a>
          </p>
        </div>
      </div>
    ));
  };

  return (
    <section className="testimonials text-center bg-light">
      <div className="container">
        <h2 className="mb-5">{heading}</h2>
        <div className="row justify-content-center">{mapDevelopers()}</div>
        <div className="row justify-content-center">{mapSupervisors()}</div>
      </div>
    </section>
  );
};
