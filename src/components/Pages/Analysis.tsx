import React, { useEffect, useRef, useState } from 'react';
import { Grid, Button, Container, Paper, ClickAwayListener, ButtonGroup, Popper, Grow, MenuList } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { IAnnotation, IMarker } from 'react-ace';
import { GraphType, webSvfApiFactory } from '../../api/webSvfApi';
import RenderSvg, { IOnGraphClickProps } from '../RenderSvg';
import { useSelector } from 'react-redux';
import { IStore } from '../../store/store';
import Editor from '../Editor';
import styled, { css } from 'styled-components';
import { IThemeProps } from '../../themes/theme';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Resizable } from 're-resizable';

const webSvfApi = webSvfApiFactory();

const graphNames: Record<GraphType, string> = {
  [GraphType.Callgraph]: 'CallGraph',
  [GraphType.Icfg]: 'ICFG',
  [GraphType.Pag]: 'PAG',
  [GraphType.Svfg]: 'SVFG',
  [GraphType.Vfg]: 'VFG'
};

const HomeWrapper = styled.div`
  height: calc(100% - ${({ theme }: IThemeProps) => theme.spacing(8)}px);
  max-height: calc(100% - ${({ theme }: IThemeProps) => theme.spacing(8)}px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;

const HomeContainer = styled(Container)`
  && {
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    padding-top: ${({ theme }: IThemeProps) => theme.spacing(3)}px;
  }
`;

const HomePaper = styled(Paper)`
  && {
    height: 100%;

    .ace_editor {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
  }
`;

const ScrollablePaper = styled(HomePaper)`
  && {
    width: 100%;
    height: 100%;
    min-width: 5%;
    position: relative;
    overflow: scroll;
  }
`;

const StaticButtonGroup = styled(ButtonGroup)`
  && {
    position: sticky;
    top: 0;
    left: ${({ theme }: IThemeProps) => theme.spacing(3)}px;
  }
`;

interface IConsoleProps {
  height?: number;
}

const Console = styled.div<IConsoleProps>`
  background-color: #252a33;
  color: #fff;
  padding: 20px;
  white-space: pre-line;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  ${({ height }) =>
    height
      ? css`
          height: ${height}px;
        `
      : css`
          height: 20%;
        `}
  overflow:scroll;
`;

const getLogPrefix = () => 'Last updated: ' + new Date();

export const Analysis: React.FC = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [consoleHeight, setConsoleHeight] = useState<number>();
  const [logs, setLogs] = useState(getLogPrefix());

  const [editorContent, setEditorContent] = useState('//write your C code here');
  const selectedFile = useSelector((store: IStore) => store.selectedFile);

  const [anlyseDropdownOpen, setAnlyseDropdownOpen] = useState(false);
  const analyseDropdownRef = React.useRef(null);
  const [selectedGraph, setSelectedGraph] = useState<GraphType>(GraphType.Callgraph);
  const [svgs, setSvgs] = useState<any>();

  useEffect(() => {
    if (selectedFile?.content) {
      setEditorContent(selectedFile?.content);
    }
  }, [selectedFile?.content]);

  const [output, setOutput] = useState('');
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const [annotations, setAnnotations] = useState<IAnnotation[]>([]);

  const onGraphClick = ({ markers, annotations }: IOnGraphClickProps) => {
    console.log('markers', markers);
    console.log('annotations', annotations);

    setMarkers(markers);
    setAnnotations(annotations);
  };

  const handleClose = (event: React.MouseEvent<Document>) => {
    if (analyseDropdownRef.current && (analyseDropdownRef.current as any).contains(event.target)) {
      return;
    }

    setAnlyseDropdownOpen(false);
  };

  const onAnalyseClick = async () => {
    setAnlyseDropdownOpen(false);

    const { logs, ...rest } = await webSvfApi.analyseAll({ fileName: 'example', code: editorContent });
    setSvgs(rest);

    setMarkers([]);
    setAnnotations([]);

    if (logs.basicLog) {
      setLogs(getLogPrefix() + logs.basicLog);
    } else if (logs.clangBugLog) {
      setLogs(getLogPrefix() + logs.clangBugLog);
    } else if (logs.svfBugLog) {
      setLogs(getLogPrefix() + logs.svfBugLog);
    }

    setOutput(rest[selectedGraph]);
  };

  if (editorContainerRef.current && !consoleHeight) {
    setConsoleHeight(editorContainerRef.current.getBoundingClientRect().height * 0.2);
  }

  const onGraphSelection = (graph: GraphType) => {
    setSelectedGraph(graph);
    setOutput(svgs[graph]);
    setAnlyseDropdownOpen(false);
  };

  return (
    <HomeWrapper>
      <HomeContainer maxWidth='xl'>
        <Grid container spacing={3} style={{ height: '100%', maxHeight: '100%' }}>
          <div
            ref={editorContainerRef}
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              overflow: 'hidden'
            }}>
            <Resizable
              onResize={(e, d, el) => {
                if (editorContainerRef.current) {
                  setConsoleHeight(editorContainerRef.current.getBoundingClientRect().height - el.getBoundingClientRect().height);
                }
              }}
              defaultSize={{
                width: '50%',
                height: '80%'
              }}
              maxHeight='80%'
              minHeight='10%'
              maxWidth='80%'
              minWidth='10%'>
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
              <Console height={consoleHeight}>{logs}</Console>
            </Resizable>

            <ScrollablePaper>
              <StaticButtonGroup variant='contained' color='primary' ref={analyseDropdownRef} aria-label='split button'>
                <Button onClick={() => onAnalyseClick()}>Analyse</Button>
                <Button
                  color='primary'
                  size='small'
                  aria-label='select merge strategy'
                  aria-haspopup='menu'
                  onClick={() => setAnlyseDropdownOpen((prevOpen) => !prevOpen)}
                  disabled={!svgs}>
                  {graphNames[selectedGraph]}
                  <ArrowDropDownIcon />
                </Button>
              </StaticButtonGroup>
              <Popper open={anlyseDropdownOpen} anchorEl={analyseDropdownRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                    }}>
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id='split-button-menu'>
                          {Object.values(GraphType).map((key) => (
                            <MenuItem key={key} selected={key === selectedGraph} onClick={() => onGraphSelection(key as GraphType)}>
                              {graphNames[key as GraphType]}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>

              {output && <RenderSvg output={output} onGraphClick={onGraphClick} />}
            </ScrollablePaper>
          </div>
        </Grid>
      </HomeContainer>
    </HomeWrapper>
  );
};
