import React from 'react';
import AceEditor, { IAnnotation, IMarker } from 'react-ace';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/webpack-resolver';

export interface IEditorProps {
  name?: string;
  markers: IMarker[];
  annotations: IAnnotation[];
  mode?: string | object;
  onChange?: (value: string, event?: any) => void;
  wrapEnabled?: boolean;
  value?: string;
}

const Editor: React.FC<IEditorProps> = ({ markers, mode, onChange, name, wrapEnabled, value, annotations }) => {
  return (
    <AceEditor
      mode={mode}
      theme='terminal'
      onChange={onChange}
      name={name}
      wrapEnabled={wrapEnabled}
      value={value}
      annotations={annotations}
      markers={markers}
      style={{ width: '100%', height: '100%', borderRadius: 4 }}
    />
  );
};

export default Editor;
