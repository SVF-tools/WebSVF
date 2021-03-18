import React, { useState, useEffect } from 'react';
import { Paper, Grid, Box } from '@material-ui/core';
import AddFile from './Components/AddFile';
import FileList from './Components/FileList';
import Editor from '../Editor/Components/Editor';
import './codefiles.css';

const CodeFiles = ({ code, setCode, markers, annotation }) => {
  const [fileName, setFileName] = useState('');
  const [dialogBox, setDialogBox] = useState(false);

  const [userCode, setUserCode] = useState([
    {
      fileID: 'init-temp',
      fileName: 'example.c',
      version: '0.0',
      content: `#include <math.h>
      #include <stdio.h>
      int main() {
          double a, b, c, discriminant, root1, root2, realPart, imagPart;
          printf("Enter coefficients a, b and c: ");
          scanf("%lf %lf %lf", &a, &b, &c);
          discriminant = b * b - 4 * a * c;
          // condition for real and different roots
          if (discriminant > 0) {
              root1 = (-b + sqrt(discriminant)) / (2 * a);
              root2 = (-b - sqrt(discriminant)) / (2 * a);
              printf("root1 = %.2lf and root2 = %.2lf", root1, root2);
          }
          // condition for real and equal roots
          else if (discriminant == 0) {
              root1 = root2 = -b / (2 * a);
              printf("root1 = root2 = %.2lf;", root1);
          }
          // if roots are not real
          else {
              realPart = -b / (2 * a);
              imagPart = sqrt(-discriminant) / (2 * a);
              printf("root1 = %.2lf+%.2lfi and root2 = %.2f-%.2fi", realPart, imagPart, realPart, imagPart);
          }
          return 0;
      } `,
      files: []
    }
  ]);
  const [selectedFile, setselectedFile] = useState(userCode[0].fileName);

  useEffect(() => {
    const elementIndex = userCode.findIndex((value) => {
      return value.fileName === selectedFile;
    });
    setCode(userCode[elementIndex].content);
  }, [selectedFile, userCode, setCode]);

  const handleAddFile = () => {
    setUserCode([
      ...userCode,
      {
        fileId: Math.random(),
        fileName: fileName,
        version: 0.1,
        content: `//write your C code here`
      }
    ]);

    closeDialog();
    clearFileName();
  };
  const handleFileName = (e) => {
    setFileName(e.target.value);
  };

  const openDialog = () => {
    setDialogBox(true);
  };

  const closeDialog = () => {
    setDialogBox(false);
    clearFileName();
  };

  const updateSelectedFile = (selectedFileName) => {
    setselectedFile(selectedFileName);
  };

  const handleChange = (newValue) => {
    setCode(newValue);

    const elementIndex = userCode.findIndex((value) => {
      return value.fileName === selectedFile;
    });
    let tempUserCode = [...userCode];

    tempUserCode[elementIndex] = {
      ...tempUserCode[elementIndex],
      content: newValue
    };

    setUserCode(tempUserCode);
  };

  const clearFileName = () => {
    setFileName('');
  };

  return (
    <div>
      <Box>
        <Grid container direction='row'>
          <Grid item>
            <Paper>
              <Grid container direction='column' justify='center'>
                <AddFile
                  handleAddFile={handleAddFile}
                  handleFileName={handleFileName}
                  clearFileName={clearFileName}
                  fileName={fileName}
                  userCode={userCode}
                  openDialog={openDialog}
                  closeDialog={closeDialog}
                  dialogBox={dialogBox}
                />
                <FileList userCode={userCode} selectedFile={selectedFile} updateSelectedFile={updateSelectedFile} />
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            {userCode.map((data, index) => {
              if (data.fileName === selectedFile) {
                return (
                  <Editor
                    key={index}
                    mode={'c_cpp'}
                    name={'main-editor'}
                    value={data.content}
                    onChange={handleChange}
                    markers={markers}
                    annotation={annotation}
                  />
                );
              }
              return '';
            })}
            {/* <Editor value={code} onChange={handleChange} /> */}
          </Grid>
        </Grid>
      </Box>
      {/* <button onClick={codeSubmit}> Submit </button>
      <h1>Response from the POST request:</h1>
      <Editor
        mode={"json"}
        theme={"terminal"}
        //onChange={onChange}
        name={"UNIQUE_ID_OF_DIV1"}
        editorProps={{ $blockScrolling: true }}
        wrapEnabled={true}
        value={response}
      /> */}
    </div>
  );
};

export default CodeFiles;
