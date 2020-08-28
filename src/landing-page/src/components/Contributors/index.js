import React from 'react';

const Contributors = ({ contributors }) => {
  const mapDevelopers = () => {
    const remainder = contributors.developers.length % 4;

    let temp = [];
    let developers = [];

    for (let i = 0; i < contributors.developers.length - remainder; ++i) {
      if (temp.length < 4) {
        const developer = (
          <div key={i} className="col-xl-3">
            <div className="testimonial-item mx-auto mb-5 mb-xl-4">
              <a
                href={`${contributors.developers[i].link}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="img-fluid rounded-circle mb-3"
                  src={`img/${contributors.developers[i].image}`}
                  alt=""
                />
              </a>
              <h5>{contributors.developers[i].name}</h5>
              <p className="font-weight-light mb-0">
                <strong>Developer</strong>
                <br />
                <a
                  href={`${contributors.developers[i].universityLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contributors.developers[i].university}
                </a>
              </p>
            </div>
          </div>
        );

        temp.push(developer);
      }

      if (temp.length === 4) {
        const developerRow = (
          <div key={i} className="row pb-3">
            {temp}
          </div>
        );

        developers.push(developerRow);

        temp = [];
      }
    }

    if (remainder > 0) {
      temp = [];
      for (
        let i = contributors.developers.length - remainder;
        i < contributors.developers.length;
        ++i
      ) {
        const columnSize = 12 / remainder;
        const developer = (
          <div key={i} className={`col-xl-${columnSize}`}>
            <div className="testimonial-item mx-auto mb-5 mb-xl-4">
              <a
                href={`${contributors.developers[i].link}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="img-fluid rounded-circle mb-3"
                  src={`img/${contributors.developers[i].image}`}
                  alt=""
                />
              </a>
              <h5>{contributors.developers[i].name}</h5>
              <p className="font-weight-light mb-0">
                <strong>Developer</strong>
                <br />
                <a
                  href={`${contributors.developers[i].universityLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contributors.developers[i].university}
                </a>
              </p>
            </div>
          </div>
        );
        temp.push(developer);
      }
      const remainderRow = <div className="row pb-3">{temp}</div>;

      developers.push(remainderRow);
    }

    return developers;
  };

  const mapSupervisors = () => {
    const remainder = contributors.supervisors.length % 4;

    let temp = [];
    let supervisors = [];

    for (let i = 0; i < contributors.supervisors.length - remainder; ++i) {
      console.log(i);
      if (temp.length < 4) {
        const supervisor = (
          <div key={i} className="col-xl-3">
            <div className="testimonial-item mx-auto mb-5 mb-xl-4">
              <a href={`${contributors.supervisors[i].link}`}>
                <img
                  className="img-fluid rounded-circle mb-3"
                  src={`img/${contributors.supervisors[i].image}`}
                  alt=""
                />
              </a>
              <h5>{contributors.supervisors[i].name}</h5>
              <p className="font-weight-light mb-0">
                Project Supervisor <br />
                <strong style={{ fontWeight: '600' }}>
                  {contributors.supervisors[i].position} <br />
                  <a
                    href={`${contributors.supervisors[i].universityLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contributors.supervisors[i].university}
                  </a>
                </strong>
              </p>
            </div>
          </div>
        );

        temp.push(supervisor);
      }

      if (temp.length === 4) {
        const supervisorRow = <div className="row pb-3">{temp}</div>;

        supervisors.push(supervisorRow);

        temp = [];
      }
    }

    if (remainder > 0) {
      temp = [];
      for (
        let i = contributors.supervisors.length - remainder;
        i < contributors.supervisors.length;
        ++i
      ) {
        const columnSize = 12 / remainder;
        const supervisor = (
          <div key={i} className={`col-xl-${columnSize}`}>
            <div className="testimonial-item mx-auto mb-5 mb-xl-4">
              <a href={`${contributors.supervisors[i].link}`}>
                <img
                  className="img-fluid rounded-circle mb-3"
                  src={`img/${contributors.supervisors[i].image}`}
                  alt=""
                />
              </a>
              <h5>{contributors.supervisors[i].name}</h5>
              <p className="font-weight-light mb-0">
                Project Supervisor <br />
                <strong style={{ fontWeight: '600' }}>
                  {contributors.supervisors[i].position} <br />
                  <a
                    href={`${contributors.supervisors[i].universityLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contributors.supervisors[i].university}
                  </a>
                </strong>
              </p>
            </div>
          </div>
        );
        temp.push(supervisor);
      }
      const remainderRow = (
        <div key={supervisors.length + 1} className="row pb-3">
          {temp}
        </div>
      );

      supervisors.push(remainderRow);
    }

    return supervisors;
  };

  return (
    <section className="testimonials text-center bg-light">
      <div className="container">
        <h2 className="mb-5">{contributors.heading}</h2>
        {mapDevelopers()}
        {mapSupervisors()}
      </div>
    </section>
  );
};

export default Contributors;
