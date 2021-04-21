import React from 'react';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-terminal';

import 'ace-builds/webpack-resolver';

const Editor = ({ markers, mode, onChange, name, editorProps, wrapEnabled, value, focus, annotation }) => {
  return (
    <div>
      {console.log('markers', markers)}
      <AceEditor
        mode={mode}
        theme='terminal'
        onChange={onChange}
        props
        name={name}
        editorProps={editorProps}
        wrapEnabled={wrapEnabled}
        value={value}
        width='40rem'
        height='30rem'
        focus={focus}
        annotations={annotation}
        markers={markers}
      />
    </div>
  );
};

export default Editor;
