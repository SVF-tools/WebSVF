import React, { useEffect, useState } from 'react';
import { Grid, Button, Container, Paper, ClickAwayListener, ButtonGroup, Popper, Grow, MenuList } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { IAnnotation, IMarker } from 'react-ace';
import { GraphNameType, webSvfApiFactory } from '../../api/webSvfApi';
import RenderSvg, { IOnGraphClickProps } from '../RenderSvg';
import { useSelector } from 'react-redux';
import { IStore } from '../../store/store';
import Editor from '../Editor';
import styled from 'styled-components';
import { IThemeProps } from '../../themes/theme';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

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
  height: calc(100% - ${({ theme }: IThemeProps) => theme.spacing(8)});
  max-height: calc(100% - ${({ theme }: IThemeProps) => theme.spacing(8)});
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
  }
`;

const ScrollablePaper = styled(HomePaper)`
  && {
    max-height: 100%;
    overflow: scroll;
  }
`;

const StaticButtonGroup = styled(ButtonGroup)`
  && {
    position: absolute;
    top: 0;
    margin-top: ${({ theme }: IThemeProps) => theme.spacing(3)};
    margin-left: ${({ theme }: IThemeProps) => theme.spacing(3)};
  }
`;

const getGraphSelectionLabel = (selection?: SelectionType) => {
  switch (selection) {
    case 'CallGraph':
      return 'Call Graph';
    case 'ICFG':
      return 'ICFG';
    case 'PAG':
      return 'PAG';
    case 'SVFG':
      return 'SVFG';
    case 'VFG':
      return 'VFG';
    default:
      return 'Please select an option';
  }
};

export const Home: React.FC = () => {
  const [editorContent, setEditorContent] = useState('//write your C code here');
  const selectedFile = useSelector((store: IStore) => store.selectedFile);

  const [anlyseDropdownOpen, setAnlyseDropdownOpen] = useState(false);
  const analyseDropdownRef = React.useRef(null);
  const [selectedGraph, setSelectedGraph] = useState<SelectionType>();

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

  const onAnalyseDropdownToggle = () => {
    setAnlyseDropdownOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (analyseDropdownRef.current && (analyseDropdownRef.current as any).contains(event.target)) {
      return;
    }

    setAnlyseDropdownOpen(false);
  };

  const onAnalyseClick = async (selection?: SelectionType) => {
    if (selection) {
      setSelectedGraph(selection);
      setAnlyseDropdownOpen(false);

      const svg = await webSvfApi.analyse({ graphName: graphNames[selection], fileName: 'example', code: editorContent });

      setMarkers([]);
      setAnnotations([]);
      setOutput(svg);
    }
  };

  return (
    <HomeWrapper>
      <HomeContainer maxWidth='xl'>
        <Grid container spacing={3} height='100%' maxHeight='100%'>
          <Grid item xs={12} md={6} lg={6} height='100%' maxHeight='100%'>
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
          <Grid item xs={12} md={6} lg={6} height='100%' maxHeight='100%' position='relative'>
            <StaticButtonGroup variant='contained' color='primary' ref={analyseDropdownRef} aria-label='split button'>
              <Button onClick={() => onAnalyseClick()}>{getGraphSelectionLabel(selectedGraph)}</Button>
              <Button color='primary' size='small' aria-label='select merge strategy' aria-haspopup='menu' onClick={onAnalyseDropdownToggle}>
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
                        {Object.keys(graphNames).map((key) => (
                          <MenuItem key={key} selected={key === selectedGraph} onClick={() => onAnalyseClick(key as SelectionType)}>
                            {getGraphSelectionLabel(key as SelectionType)}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <ScrollablePaper>{output && <RenderSvg output={output} onGraphClick={onGraphClick} />}</ScrollablePaper>
          </Grid>
        </Grid>
      </HomeContainer>
    </HomeWrapper>
  );
};
