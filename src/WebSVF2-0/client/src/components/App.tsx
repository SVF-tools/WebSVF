import React, { useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import { Grid, Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CodeFiles from './CodeFiles/CodeFiles';
import RenderSvg, { IOnGraphClickProps } from './RenderSvg';
import webSvgApiFactory, { IAnalysisProps } from '../api/webSvfApi';
import { IAnnotation, IMarker } from 'react-ace';
import Layout from './Layout/Layout';
import Typography from '@material-ui/core/Typography';

const webSvgApi = webSvgApiFactory();

type SelectionType = 'CallGraph' | 'ICFG' | 'PAG' | 'SVFG' | 'VFG';
type SelectionApiType = { [key in SelectionType]: (props: IAnalysisProps) => Promise<string> };

const selectionApis: SelectionApiType = {
  CallGraph: webSvgApi.callGraph,
  ICFG: webSvgApi.genIcfg,
  PAG: webSvgApi.genPag,
  SVFG: webSvgApi.genSvfg,
  VFG: webSvgApi.genVfg
};

const App: React.FC = () => {
  const codeRef = useRef('//write your C code here');

  const onSetCode = (code: string) => (codeRef.current = code);

  const [output, setOutput] = useState('');
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const [annotation, setAnnotation] = useState<IAnnotation[]>([]);
  const [graphDialog, setGraphDialog] = useState(false);
  const [graphDialogTitle, setGraphDialogTitle] = useState('');

  const handleGraphDialog = () => {
    setGraphDialog(true);
  };

  const handleSelection = async (e: any) => {
    const selection = e.target.value as SelectionType;

    const svg = await selectionApis[selection]({ code: codeRef.current, fileName: 'example' });

    setMarkers([]);
    setAnnotation([]);
    setGraphDialogTitle(selection);
    setOutput(svg);
  };

  const onGraphClick = ({ markers, annotation }: IOnGraphClickProps) => {
    console.log('markers', markers);
    console.log('annotation', annotation);

    setMarkers(markers);
    setAnnotation(annotation);
  };

  const onCloseGraphDialog = () => {
    setGraphDialog(false);
    setGraphDialogTitle('');
  };
  return (
    <Layout>
      <Grid container alignItems='center' direction='column'>
        <Grid item>
          <Box my={3}>
            <CodeFiles setCode={onSetCode} markers={markers} annotation={annotation} />
          </Box>
        </Grid>
        <Grid container alignItems='center' direction='column'>
          <Grid>
            <Button onClick={() => {}}>Bug Report</Button>
            <Button onClick={handleGraphDialog}>Graphs</Button>
          </Grid>
          <Grid container alignItems='center' direction='column'></Grid>
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

          {graphDialogTitle === '' ? (
            <Box p={5}>
              <Typography variant='h6'>No Graph Selected</Typography>
            </Box>
          ) : (
            <RenderSvg output={output} onGraphClick={onGraphClick} onClose={onCloseGraphDialog} />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default App;
