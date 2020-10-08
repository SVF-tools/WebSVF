import React from "react";

const Iframe = (props) => {
  console.log(props.source + "this is source from Iframe.js");
  if (!props.source) {
    return <div>Loading...</div>;
  } else {
    //const src = props.source;
    return (
      <div className="dashboard__main">
        <div className="content-wrapper">
          <div>
            <div className="row d-flex justify-content-between"></div>
            <div className="embed-responsive embed-responsive-1by1">
              <iframe
                className="embed-responsive-item px-4"
                title="codespace"
                src={props.source}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      // <div>
      //     <div>
      //         <iframe src={src} frameborder="0"></iframe>
      //     </div>
      // </div>
    );
  }
};

export default Iframe;
