import React from 'react';

import AceEditor, { IAnnotation, IMarker } from 'react-ace';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-terminal';

import 'ace-builds/webpack-resolver';

export interface IEditorProps {
  name?: string;
  markers: IMarker[];
  annotation: IAnnotation[];
  mode?: string | object;
  onChange?: (value: string, event?: any) => void;
  editorProps?: IEditorProps;
  wrapEnabled?: boolean;
  value?: string;
  focus?: boolean;
}

const Editor: React.FC<IEditorProps> = ({ markers, mode, onChange, name, editorProps, wrapEnabled, value, focus, annotation }) => {
  return (
    <div>
      {console.log('markers', markers)}
      <AceEditor
        mode={mode}
        theme='terminal'
        onChange={onChange}
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
