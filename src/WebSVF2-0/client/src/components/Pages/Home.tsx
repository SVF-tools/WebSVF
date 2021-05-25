import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { Grid, Button, Container, Paper } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { IAnnotation, IMarker } from 'react-ace';
import Typography from '@material-ui/core/Typography';
import { GraphNameType, webSvfApiFactory } from '../../api/webSvfApi';
import RenderSvg, { IOnGraphClickProps } from '../RenderSvg';
import { useSelector } from 'react-redux';
import { IStore } from '../../store/store';
import Editor from '../Editor';
import styled from 'styled-components';
import { IThemeProps } from '../../themes/theme';

const webSvfApi = webSvfApiFactory();

type SelectionType = 'CallGraph' | 'ICFG' | 'PAG' | 'SVFG' | 'VFG';
type SelectionApiType = { [key in SelectionType]: GraphNameType };

const graphNames: SelectionApiType = {
  CallGraph: 'callgraph',
  ICFG: 'icfg',
  PAG: 'pag',
  SVFG: 'svfg',
  VFG: 'vfg'
};

const HomeWrapper = styled.div`
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const HomeContainer = styled(Container)`
  && {
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    padding-top: ${({ theme }: IThemeProps) => theme.spacing(3)};
  }
`;

const HomePaper = styled(Paper)`
  && {
    height: 100%;
    max-height: 100%;
  }
`;

export const Home: React.FC = () => {
  const [editorContent, setEditorContent] = useState('//write your C code here');
  const selectedFile = useSelector((store: IStore) => store.selectedFile);

  useEffect(() => {
    if (selectedFile?.content) {
      setEditorContent(selectedFile?.content);
    }
  }, [selectedFile?.content]);

  const [output, setOutput] = useState('');
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const [annotations, setAnnotations] = useState<IAnnotation[]>([]);
  const [graphDialog, setGraphDialog] = useState(false);
  const [graphDialogTitle, setGraphDialogTitle] = useState('');

  const handleGraphDialog = () => {
    setGraphDialog(true);
  };

  const handleSelection = async (e: any) => {
    const selection = e.target.value as SelectionType;

    const svg = await webSvfApi.analyse({ graphName: graphNames[selection], fileName: 'example', code: editorContent });

    setMarkers([]);
    setAnnotations([]);
    setGraphDialogTitle(selection);
    setOutput(svg);
  };

  const onGraphClick = ({ markers, annotations }: IOnGraphClickProps) => {
    console.log('markers', markers);
    console.log('annotations', annotations);

    setMarkers(markers);
    setAnnotations(annotations);
  };

  const onCloseGraphDialog = () => {
    setGraphDialog(false);
    setGraphDialogTitle('');
  };
  return (
    <HomeWrapper>
      <HomeContainer maxWidth='xl'>
        <Grid container spacing={3} height='100%'>
          <Grid item xs={12} md={6} lg={6}>
            <HomePaper>
              <Editor
                mode='c_cpp'
                onChange={(value) => setEditorContent(value)}
                name='main-editor'
                value={editorContent}
                annotations={annotations}
                markers={markers}
              />
            </HomePaper>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            {graphDialogTitle === '' ? (
              <Box p={5}>
                <Typography variant='h6'>No Graph Selected</Typography>
              </Box>
            ) : (
              <RenderSvg output={output} onGraphClick={onGraphClick} onClose={onCloseGraphDialog} />
            )}
          </Grid>
          <Grid item xs={12}>
            <Button onClick={() => {}}>Bug Report</Button>
            <Button onClick={handleGraphDialog}>Graphs</Button>
          </Grid>
        </Grid>
        <Dialog maxWidth='xl' open={graphDialog} onClose={onCloseGraphDialog}>
          <DialogTitle>{graphDialogTitle}</DialogTitle>
          <DialogContent>
            <Grid container alignItems='center' direction='column'>
              <TextField select label='Graph' value={graphDialogTitle} onChange={handleSelection} helperText='Select Graph to be displayed'>
                <MenuItem value='CallGraph'>CallGraph</MenuItem>
                <MenuItem value='ICFG'>ICFG</MenuItem>
                <MenuItem value='PAG'>PAG</MenuItem>
                <MenuItem value='SVFG'>SVFG</MenuItem>
                <MenuItem value='VFG'>VFG</MenuItem>
              </TextField>
            </Grid>
          </DialogContent>
        </Dialog>
      </HomeContainer>
    </HomeWrapper>
  );
};
