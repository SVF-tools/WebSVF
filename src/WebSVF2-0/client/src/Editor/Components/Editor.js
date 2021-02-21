import React from "react";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-terminal";

import "ace-builds/webpack-resolver";

const Editor = (props) => {
  return (
    <div>
      {console.log(props.markers)}
      <AceEditor
        mode={props.mode}
        theme='terminal'
        onChange={props.onChange}
        name={props.name}
        editorProps={props.editorProps}
        wrapEnabled={props.wrapEnabled}
        value={props.value}
        width='40rem'
        height='30rem'
        focus={props.focus}
        annotations={props.annotation}
        markers={props.markers}
      />
    </div>
  );
};

export default Editor;
