import React, { useState } from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { Grid, Typography, Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CodeFiles from './CodeFiles/index';
import { Toolbar } from '@material-ui/core';
import websvf from './api/websvf';
import RenderSVG from './RenderSVG/RenderSVG';

function App() {
  const [code, setCode] = useState(`//write your C code here`);
  const [output, setOutput] = useState('');
  const [markers, setMarkers] = useState([]);
  const [annotation, setAnnotation] = useState([]);
  const [graphDialog, setGraphDialog] = useState(false);
  const [graphDialogTitle, setGraphDialogTitle] = useState('');

  const handleGraphDialog = () => {
    //setGraphDialogTitle(e.target.value);
    setGraphDialog(true);
  };

  const handleSelection = (e) => {
    let selected = e.target.value;
    // setGraphDialogTitle(selected);
    if (selected === 'CallGraph') {
      genCallGraph(selected);
    } else if (selected === 'ICFG') {
      genICFG(selected);
    } else if (selected === 'PAG') {
      genPAG(selected);
    } else if (selected === 'SVFG') {
      genSVFG(selected);
    } else if (selected === 'VFG') {
      genVFG(selected);
    }
    console.log(selected);
  };
  const genCallGraph = async (selected) => {
    const response = await websvf.post('/analysis/callGraph', {
      code: code,
      fileName: 'example'
    });
    if (response) {
      setMarkers([]);
      setAnnotation([]);
      setGraphDialogTitle(selected);
      setOutput(response.data);
    }
  };

  const genICFG = async (selected) => {
    const response = await websvf.post('/analysis/icfg', {
      code: code,
      fileName: 'example'
    });
    if (response) {
      setMarkers([]);
      setAnnotation([]);
      setGraphDialogTitle(selected);
      setOutput(response.data);
    }
  };

  const genSVFG = async (selected) => {
    const response = await websvf.post('/analysis/svfg', {
      code: code,
      fileName: 'example'
    });
    if (response) {
      setMarkers([]);
      setAnnotation([]);
      setGraphDialogTitle(selected);
      setOutput(response.data);
    }
  };

  const genVFG = async (selected) => {
    const response = await websvf.post('/analysis/vfg', {
      code: code,
      fileName: 'example'
    });
    if (response) {
      setMarkers([]);
      setAnnotation([]);
      setGraphDialogTitle(selected);
      setOutput(response.data);
    }
  };
  const genPAG = async (selected) => {
    const response = await websvf.post('/analysis/pag', {
      code: code,
      fileName: 'example'
    });
    if (response) {
      setMarkers([]);
      setAnnotation([]);
      setGraphDialogTitle(selected);
      setOutput(response.data);
    }
  };
  const updateMarker = (newValue) => {
    console.log(newValue);
    setMarkers(newValue);
  };
  const updateAnnotation = (newValue) => {
    console.log(newValue);
    setAnnotation(newValue);
  };

  const closeGraphDialog = () => {
    setGraphDialog(false);
    setGraphDialogTitle('');
  };
  return (
    <div className='App'>
      <AppBar position='static' color='primary'>
        <Toolbar>
          <Typography variant='h4'>WEBSVF</Typography>
        </Toolbar>
      </AppBar>
      <Grid container justify='center' alignItems='center' direction='column'>
        <Grid item>
          <Box my={3}>
            {console.log(markers)}
            <CodeFiles code={code} setCode={setCode} markers={markers} annotation={annotation} />
          </Box>
        </Grid>
        <Grid container justify='center' alignItems='center' direction='column'>
          <Grid>
            <Button onClick={() => {}}>Bug Report</Button>
            <Button onClick={handleGraphDialog}>Graphs</Button>
          </Grid>
          <Grid container justify='center' alignItems='center' direction='column'></Grid>
        </Grid>
      </Grid>
      <Dialog maxWidth='xl' open={graphDialog} onClose={closeGraphDialog}>
        <DialogTitle>{graphDialogTitle}</DialogTitle>
        <DialogContent>
          <Grid container justify='center' alignItems='center' direction='column'>
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
              <h1>No Graph Selected</h1>
            </Box>
          ) : (
            <RenderSVG output={output} code={code} markers={markers} updateMarker={updateMarker} updateAnnotation={updateAnnotation} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
