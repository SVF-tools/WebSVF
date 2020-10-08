import React from "react";

import "./loader.scss";

const Loader = () => {
  return (
    <div className="loader row d-flex justify-content-center text-center">
      <div className="col text-center">
        <p className="message">Preparing...</p>
        <i className="fa fa-cog fa-spin" />
      </div>
    </div>
  );
};

export default Loader;
