import React, { useState, useEffect } from 'react';
import { Paper, Grid, Box } from '@material-ui/core';
import AddFile from './AddFile';
import FileList from './FileList';
import Editor from '../Editor';
import { IUserCode } from '../../models/UserCode';
import { IAnnotation, IMarker } from 'react-ace';

export interface ICodeFilesProps {
  setCode: (code: string) => void;
  markers: IMarker[];
  annotation: IAnnotation[];
}

const CodeFiles: React.FC<ICodeFilesProps> = ({ setCode, markers, annotation }) => {
  const [fileName, setFileName] = useState('');
  const [dialogBox, setDialogBox] = useState(false);

  const [userCode, setUserCode] = useState<IUserCode[]>([
    {
      fileId: 'init-temp',
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
      } `
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
        fileId: Math.random().toString(),
        fileName: fileName,
        version: '0.1',
        content: `//write your C code here`
      }
    ]);

    closeDialog();
    clearFileName();
  };
  const handleFileName = (e: any) => {
    setFileName(e.target.value);
  };

  const openDialog = () => {
    setDialogBox(true);
  };

  const closeDialog = () => {
    setDialogBox(false);
    clearFileName();
  };

  const updateSelectedFile = (selectedFileName: string) => {
    setselectedFile(selectedFileName);
  };

  const handleChange = (newValue: string) => {
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
              <Grid container direction='column' alignItems='center'>
                <AddFile
                  onCreateFile={handleAddFile}
                  onFileNameTextFieldChange={handleFileName}
                  fileName={fileName}
                  userCodes={userCode}
                  onDialogOpen={openDialog}
                  onDialogClose={closeDialog}
                  open={dialogBox}
                />
                <FileList userCodes={userCode} selectedFile={selectedFile} updateSelectedFile={updateSelectedFile} />
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
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default CodeFiles;
