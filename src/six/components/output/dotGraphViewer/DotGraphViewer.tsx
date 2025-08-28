import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Graphviz } from 'graphviz-react';
import './dotGraphViewer.css';
import GraphButton from '../../tooltip/GraphButton';

// Helper function to determine default node colors based on SVF node types
const getDefaultNodeColor = (nodeString: string): string | null => {
  if (nodeString.includes('FunEntryBlockNode') || nodeString.includes('FormalParmVFGNode')) {
    return 'yellow';
  }
  if (nodeString.includes('FunExitBlockNode') || nodeString.includes('FormalRetVFGNode')) {
    return 'green';
  }
  if (nodeString.includes('CallBlockNode') || nodeString.includes('ActualParmVFGNode')) {
    return 'red';
  }
  if (nodeString.includes('RetBlockNode') || nodeString.includes('ActualRetVFGNode')) {
    return 'blue';
  }
  if (nodeString.includes('LoadVFGNode')) {
    return 'red';
  }
  if (nodeString.includes('StoreVFGNode')) {
    return 'blue';
  }
  if (nodeString.includes('AddrVFGNode')) {
    return 'green';
  }
  if (nodeString.includes('GepVFGNode')) {
    return 'purple';
  }
  if (nodeString.includes('CopyVFGNode')) {
    return 'black';
  }
  if (nodeString.includes('NullPtrVFGNode')) {
    return 'grey';
  }
  if (nodeString.includes('PHIVFGNode')) {
    return 'black';
  }
  if (
    nodeString.includes('BinaryOPVFGNode') ||
    nodeString.includes('UnaryOPVFGNode') ||
    nodeString.includes('CmpVFGNode')
  ) {
    return 'black';
  }
  return null;
};

const getNodes = (matchedDigraph: RegExpExecArray) => {
  const graphContent = matchedDigraph[1].trim();
  const splitGraphContent = graphContent.split('\n\t');

  const removedEmptyStrings = splitGraphContent.filter((part) => part.trim() !== '');
  removedEmptyStrings.shift();

  const edgePattern = /(\w+:)+\s+->\s+(\w+:)+/g;
  return removedEmptyStrings.filter((item) => !edgePattern.test(item));
};

interface DotGraphViewerProps {
  setlineNumToHighlight: (newLineNumToHighlight: Set<number>) => void;
  graphObj: { [key: string]: string };
  lineNumDetails: { [lineNum: string]: { nodeOrllvm: string[]; colour: string } };
  setLineNumDetails: React.Dispatch<
    React.SetStateAction<{
      [lineNum: string]: { nodeOrllvm: string[]; colour: string };
    }>
  >;
  currCodeLineNum: number;
  code: string;
  setPassedPrompt?: (prompt: string) => void;
}

// These are the colours that will be used for the background of the nodes and highlight colour for the code editor
const highlightColours = [
  '#D9F0E9',
  '#FFFFE3',
  '#E9E8F1',
  '#FFD6D2',
  '#D4E5EE',
  '#D5E4EF',
  '#FFE5C9',
  '#E5F4CD',
  '#F2F2F0',
  '#E9D6E7',
  '#EDF8EA',
  '#FFF8CF',
];

const DotGraphViewer: React.FC<DotGraphViewerProps> = ({
  setlineNumToHighlight,
  graphObj,
  lineNumDetails,
  setLineNumDetails,
  currCodeLineNum,
  code,
  setPassedPrompt,
}) => {
  /*  currentGraph holds the name of the current graph
      e.g currentGraph = 'callgraph.dot' or currentGraph = 'vfg.dot'
      it also holds the current key of the graphObj
  */
  const [currentGraph, setCurrentGraph] = useState('');

  /*
    graphString is the digraph string which graphviz will use to render the graph
    The string is the value of the key in graphObj
    e.g graphString = `digraph "callgraph" { ... }`
  */
  const [graphString, setGraphString] = useState('');

  useEffect(() => {
    // Check if "pag" exists in graphObj, otherwise use the first graph as default
    if (Object.keys(graphObj).length > 0 && !currentGraph) {
      const defaultGraphKey = graphObj['pag'] ? 'pag' : Object.keys(graphObj)[0];
      setCurrentGraph(defaultGraphKey);
      setGraphString(graphObj[defaultGraphKey]);
    }
  }, [graphObj, currentGraph]); // This will run when graphObj is updated

  // Used to set the width and height of the DotGraphViewer
  const graphWidth = window.innerWidth * 0.5;
  const graphHeight = window.innerHeight * 0.85;

  const graphRef = useRef<HTMLDivElement>(null);
  const processedKeyRef = useRef<string>('');
  const lastHighlightSigRef = useRef<string>('');

  /*
    The use effect below is used to add an event listener to each node in the graph
    The event listener is used to trigger an event when a node is clicked on.
    Even though an event listener is added to every node. An event only occurs for nodes that have a line number in them.
    If the graph is a call graph. Then all nodes can trigger an event.
    The event is: When a node is clicked, the line numbers of the code that the node represents will be highlighted
  */
  useEffect(() => {
    let attachedSvg: SVGSVGElement | null = null;
    let attachAttempts = 0;
    const maxAttempts = 20;

    const handleClickGeneral = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const node = target?.closest('g.node');
      if (!node) return;
      const nodeTextList = node.querySelectorAll('text');
      const nodeTextContentList: string[] = [];
      nodeTextList.forEach((nodeText) => {
        if (nodeText.textContent) {
          nodeTextContentList.push(nodeText.textContent);
        }
      });

      if (currentGraph === 'callgraph' || currentGraph === 'ptacg' || currentGraph === 'tcg') {
        const funcPattern = /fun:\s*([^}]+)/;
        let funcTofind = '';
        for (const callNodeText of nodeTextContentList) {
          const match = funcPattern.exec(callNodeText);
          if (match) {
            const funcString = match[0];
            funcTofind = funcString.replace('fun: ', '');
            break;
          }
        }
        const newlineNumToHighlight: Set<number> = new Set<number>();
        Object.keys(lineNumDetails).forEach((lineNum) => {
          const nodes = lineNumDetails[lineNum].nodeOrllvm;
          if (nodes.includes(funcTofind)) {
            newlineNumToHighlight.add(parseInt(lineNum, 10));
          }
        });
        setlineNumToHighlight(newlineNumToHighlight);
      } else {
        const lineRegex = /line:\s*(\d+)/g;
        const lnRegex = /ln:\s*(\d+)/g;
        const lnJsonRegex = /\\"ln\\":\s*(\d+)/g;
        const lineJsonRegex = /\\"line\\":\s*(\d+)/g;

        let matchLineNum: RegExpExecArray | null;
        const newlineNumToHighlight: Set<number> = new Set<number>();
        nodeTextContentList.forEach((nodeText) => {
          if ((matchLineNum = lineRegex.exec(nodeText)) !== null) {
            newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
          } else if ((matchLineNum = lnRegex.exec(nodeText)) !== null) {
            newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
          } else if ((matchLineNum = lnJsonRegex.exec(nodeText)) !== null) {
            newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
          } else if ((matchLineNum = lineJsonRegex.exec(nodeText)) !== null) {
            newlineNumToHighlight.add(parseInt(matchLineNum[1], 10));
          }
        });
        setlineNumToHighlight(newlineNumToHighlight);
      }
    };

    const tryAttach = () => {
      const container = graphRef.current;
      if (!container) return;
      const svg = container.querySelector('svg') as SVGSVGElement | null;
      if (svg) {
        attachedSvg = svg;
        svg.addEventListener('click', handleClickGeneral);
        return true;
      }
      return false;
    };

    if (!tryAttach()) {
      const interval = setInterval(() => {
        attachAttempts++;
        if (tryAttach() || attachAttempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 100);
      return () => {
        clearInterval(interval);
        if (attachedSvg) attachedSvg.removeEventListener('click', handleClickGeneral);
      };
    }

    return () => {
      if (attachedSvg) attachedSvg.removeEventListener('click', handleClickGeneral);
    };
  }, [currentGraph, lineNumDetails, setlineNumToHighlight]);

  const addFillColorToNode = useCallback(
    (nodeIDColour: { [key: string]: string }, graphString: string) => {
      const graphContentPattern = /digraph\s*".*?"\s*{([\s\S]*)}/;
      const match = graphContentPattern.exec(graphString);

      if (match) {
        const nodesOnly = getNodes(match);
        const modifiedNodes: Array<{ original: string; modified: string }> = [];

        nodesOnly.forEach((originalNode) => {
          if (originalNode.includes('shape')) {
            let nodeModified = false;
            let currentNode = originalNode;

            if (!currentNode.includes('color=') && !currentNode.includes('fillcolor=')) {
              const defaultColor = getDefaultNodeColor(currentNode);
              if (defaultColor) {
                const styleAddition = `, color=${defaultColor}, style=filled, fillcolor="${defaultColor}"`;
                currentNode =
                  currentNode.substring(0, currentNode.length - 2) + styleAddition + '];';
                nodeModified = true;
              }
            }

            for (const nodeId in nodeIDColour) {
              if (currentNode.includes(nodeId)) {
                const fillColorStyle = currentNode.includes('fillcolor=')
                  ? ''
                  : `, fillcolor="${nodeIDColour[nodeId]}"`;
                const styleAttribute = currentNode.includes('style=') ? '' : ', style=filled';
                const addingFillColour = `${styleAttribute}${fillColorStyle}];`;
                currentNode = currentNode.substring(0, currentNode.length - 2) + addingFillColour;
                nodeModified = true;
                break;
              }
            }

            if (
              originalNode.toLowerCase().includes('null') ||
              originalNode.toLowerCase().includes('nullptr') ||
              originalNode.toLowerCase().includes('null-deref')
            ) {
              const nullStyleAttribute = currentNode.includes('style=') ? '' : ', style=filled';
              const addingNullHighlight = `${nullStyleAttribute}, fillcolor="red"];`;
              currentNode = currentNode.substring(0, currentNode.length - 2) + addingNullHighlight;
              nodeModified = true;
            }

            if (nodeModified) {
              modifiedNodes.push({ original: originalNode, modified: currentNode });
            }
          }
        });

        let newGraphString = graphString;
        modifiedNodes.forEach((moddedNode) => {
          newGraphString = newGraphString.replace(moddedNode['original'], moddedNode['modified']);
        });
        if (modifiedNodes.length > 0) {
          setGraphString(newGraphString);
        }
      }
    },
    []
  );

  const addFillColorToCallNode = useCallback(
    (codeBylines: string[]) => {
      const graphContentPattern = /digraph\s*".*?"\s*{([\s\S]*)}/;

      // Execute the regex to find a match
      const match = graphContentPattern.exec(graphString);

      if (match) {
        const graphContent = match[1].trim();
        const splitGraphContent = graphContent.split('\n\t');

        // Filter out any empty strings that might occur from the split
        const removedEmptyStrings = splitGraphContent.filter((part) => part.trim() !== '');

        removedEmptyStrings.shift();

        /*
      Removing edges from the list
      */
        const edgePattern = /([\w:]+)\s+->\s+([\w:]+)/g;
        const funcs: string[] = [];
        const nodesOnly = removedEmptyStrings.filter((item) => !edgePattern.test(item));
        const funcPattern = /fun: ([^\\]+)\\/;
        nodesOnly.forEach((callNode) => {
          const match = funcPattern.exec(callNode);
          if (match) {
            const funcString = match[0];
            const removeFun = funcString.replace('fun: ', '');
            /// TODO: Naive approach. Assumes functions are funcName( i.e there are no spaces between funcName and the bracket
            const removeBackSlash = removeFun.replace('\\', '(');
            funcs.push(removeBackSlash);
          }
        });
        const funcLineColor: { [func: string]: { line: Set<number>; colour: string } } = {};
        const lineNumToNodes: { [key: string]: { nodeOrllvm: string[]; colour: string } } = {};
        const funcToColour: { [func: string]: string } = {};

        codeBylines.forEach((codeLine, index) => {
          funcs.forEach((func) => {
            // Need to account for comments
            if (codeLine.includes(func)) {
              const funcWithSlash = func.replace('(', '\\');
              const funcName = func.replace('(', '');
              if (func in funcLineColor) {
                funcLineColor[func].line.add(index + 1);
                lineNumToNodes[index + 1] = {
                  nodeOrllvm: [funcName],
                  colour: funcLineColor[func].colour,
                };
              } else {
                const lineNumbers = new Set<number>();
                lineNumbers.add(index + 1);
                const currSizeFunc: number = Object.keys(funcLineColor).length;
                funcLineColor[func] = {
                  line: lineNumbers,
                  colour: highlightColours[currSizeFunc % highlightColours.length],
                };
                // line num to nodes
                lineNumToNodes[index + 1] = {
                  nodeOrllvm: [funcName],
                  colour: highlightColours[currSizeFunc % highlightColours.length],
                };
                funcToColour[funcWithSlash] =
                  highlightColours[currSizeFunc % highlightColours.length];
              }
            }
          });
        });

        addFillColorToNode(funcToColour, graphString);
        // Merge with any existing highlights instead of overwriting
        setLineNumDetails((prev) => ({ ...prev, ...lineNumToNodes }));
      }
    },
    [graphString, addFillColorToNode, setLineNumDetails]
  );

  useEffect(() => {
    if (!currentGraph) return;
    const raw = graphObj[currentGraph];
    if (!raw) return;
    const key = `${currentGraph}|${raw.length}|${code.length}`;
    if (processedKeyRef.current === key) return;

    if (currentGraph === 'callgraph' || currentGraph === 'ptacg' || currentGraph === 'tcg') {
      const codeBylines = code.split('\n');
      addFillColorToCallNode(codeBylines);
      processedKeyRef.current = key;
      return;
    }

    // Process the raw graph string to extract line numbers and assign colors
    const lineNumToNodes: { [key: string]: { nodeOrllvm: string[]; colour: string } } = {};
    const rawGraphString = raw;

    const graphContentPattern = /digraph\s*".*?"\s*{([\s\S]*)}/;
    const match = graphContentPattern.exec(rawGraphString);
    if (!match) return;

    const graphContent = match[1].trim();
    const lines = graphContent.split('\n');
    lines.forEach((line) => {
      if (line.includes('[') && line.includes('label=')) {
        const nodeIdMatch = line.match(/^[\s\t]*(Node\w+)/);
        if (nodeIdMatch) {
          const nodeId = nodeIdMatch[1];
          const lineRegex = /line:\s*(\d+)/g;
          const lnRegex = /ln:\s*(\d+)/g;
          const lnJsonRegex = /\\"ln\\":\s*(\d+)/g;
          const lineJsonRegex = /\\"line\\":\s*(\d+)/g;
          const matchLineNum: RegExpExecArray | null =
            lineRegex.exec(line) ||
            lnRegex.exec(line) ||
            lnJsonRegex.exec(line) ||
            lineJsonRegex.exec(line);
          if (matchLineNum) {
            const lineNumber = matchLineNum[1];
            if (lineNumber in lineNumToNodes) {
              lineNumToNodes[lineNumber]['nodeOrllvm'].push(nodeId);
            } else {
              lineNumToNodes[lineNumber] = { nodeOrllvm: [nodeId], colour: '' };
            }
          }
        }
      }
    });

    const lineNums = Object.keys(lineNumToNodes);
    const numericKeys = lineNums.map((k) => parseInt(k, 10)).sort((a, b) => a - b);
    const nodeIDColour: { [key: string]: string } = {};
    numericKeys.forEach((ln, idx) => {
      const colour = highlightColours[idx % highlightColours.length];
      lineNumToNodes[ln.toString()].colour = colour;
      lineNumToNodes[ln.toString()].nodeOrllvm.forEach((nodeId) => {
        nodeIDColour[nodeId] = colour;
      });
    });

    if (Object.keys(nodeIDColour).length > 0) {
      addFillColorToNode(nodeIDColour, rawGraphString);
      setLineNumDetails((prev) => ({ ...prev, ...lineNumToNodes }));
    } else {
      addFillColorToNode({}, rawGraphString);
    }

    processedKeyRef.current = key;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGraph, graphObj, code]);

  const currentLineMapping = lineNumDetails[currCodeLineNum];

  useEffect(() => {
    // Only run when graphString actually changes or when the mapping for currCodeLineNum changes
    if (!(currCodeLineNum > 0 && currCodeLineNum in lineNumDetails)) {
      return;
    }
    // Only attempt highlight when a graph is selected and we have content
    if (!currentGraph || !graphString) return;

    const graphContentPattern = /digraph\s*".*?"\s*{([\s\S]*)}/;
    setGraphString((prev) => {
      if (!prev) return prev;
      const sig = `${currentGraph}|${currCodeLineNum}|${prev.length}`;
      if (lastHighlightSigRef.current === sig) {
        return prev;
      }
      let next = prev;
      // Remove previous red highlights once
      if (next.includes(', fontcolor=red')) {
        next = next.replace(/, fontcolor=red/g, '');
      }
      const match = graphContentPattern.exec(next);
      if (!match) return prev;
      const nodesOnly = getNodes(match);
      let modified = false;
      const highlightIds = currentLineMapping['nodeOrllvm'];
      for (const originalNode of nodesOnly) {
        if (!originalNode.includes('shape')) continue;
        for (const nodeId of highlightIds) {
          if (originalNode.includes(nodeId)) {
            const modifiedString = `${originalNode.substring(
              0,
              originalNode.length - 2
            )}, fontcolor=red];`;
            const replaced = next.replace(originalNode, modifiedString);
            if (replaced !== next) {
              next = replaced;
              modified = true;
            }
            break;
          }
        }
      }
      // Only trigger a state update if the final string actually differs
      if (modified && next !== prev) {
        lastHighlightSigRef.current = sig;
        return next;
      }
      return prev;
    });
    // We intentionally depend only on the specific mapping for the current line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGraph, currCodeLineNum, currentLineMapping]);

  const graphBtnClick = (graphKey: string) => {
    if (graphKey !== currentGraph) {
      // Clear stale highlights and mappings when switching graphs so the code editor
      // reflects only the new graph's node→line associations
      setLineNumDetails({});
      setlineNumToHighlight(new Set());
      processedKeyRef.current = '';
      lastHighlightSigRef.current = '';
      setGraphString(graphObj[graphKey]);
      setCurrentGraph(graphKey);
    }
  };

  const [renderVersion, setRenderVersion] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fsBodyRef = useRef<HTMLDivElement | null>(null);
  const [fsSize, setFsSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const resetZoom = useCallback(() => {
    // Force a re-render of the Graphviz component to reset zoom/fit
    setRenderVersion((v) => v + 1);
  }, []);

  // chg
  const exportGraphAsSVG = () => {
    const svgElement = graphRef.current?.querySelector('svg');
    if (!svgElement) return;

    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

    // Ensure full dimensions are preserved (even if it's bigger than the view)
    const bbox = svgElement.getBBox(); // Gets the true size of all visible elements
    clonedSvg.setAttribute('viewBox', `0 0 ${bbox.width} ${bbox.height}`);
    clonedSvg.removeAttribute('width');
    clonedSvg.removeAttribute('height');

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(svgBlob);
    link.download = `${(currentGraph || 'graph').replace(/[^a-z0-9_-]/gi, '_')}.svg`;
    link.click();
  };

  // Track fullscreen container size to stretch graph to fit
  useEffect(() => {
    if (!isFullscreen) return;
    const el = fsBodyRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setFsSize({ w: Math.floor(rect.width), h: Math.floor(rect.height) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [isFullscreen]);

  return (
    <>
      <div className="graph-container">
        <div id="graph-button-container">
          {Object.keys(graphObj).map((graphKey) => (
            <GraphButton
              key={graphKey}
              graphKey={graphKey}
              isSelected={currentGraph === graphKey}
              onClick={() => graphBtnClick(graphKey)}
              setPassedPrompt={setPassedPrompt}
            />
          ))}
        </div>
        <div id="graph-container">
          <div id="graphcontainer-menu-bar">
            <button onClick={resetZoom}>Reset Zoom</button>
            <button onClick={exportGraphAsSVG}>Export as SVG</button>
            <button onClick={() => setIsFullscreen(true)}>Fullscreen</button>
          </div>
          <div ref={graphRef} id="graphviz-container">
            {graphString ? (
              <Graphviz
                key={`${currentGraph}-${graphString.length}-${renderVersion}`}
                dot={graphString}
                options={{
                  zoom: true,
                  width: graphWidth,
                  height: graphHeight,
                  useWorker: false,
                  fit: true,
                  // zoomScaleExtent: [0.5, 2],
                  // zoomTranslateExtent: [[-1000, -1000], [1000, 1000]],
                }}
              />
            ) : (
              <div className="empty-state" role="status" aria-live="polite">
                <div className="empty-icon" aria-hidden>
                  🗺️
                </div>
                <div className="empty-title">No graph to display</div>
                <div className="empty-subtitle">
                  Run analysis to generate graphs, then pick a tab.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div className="graph-fullscreen-overlay" onClick={() => setIsFullscreen(false)}>
          <div className="graph-fullscreen-container" onClick={(e) => e.stopPropagation()}>
            <div className="graph-fullscreen-header">
              <div>
                <button onClick={resetZoom}>Reset Zoom</button>
                <button onClick={exportGraphAsSVG}>Export as SVG</button>
                <button onClick={() => setIsFullscreen(false)}>Close</button>
              </div>
            </div>
            <div className="graph-fullscreen-body" ref={fsBodyRef}>
              {graphString ? (
                <Graphviz
                  key={`fs-${currentGraph}-${graphString.length}-${renderVersion}`}
                  dot={graphString}
                  options={{
                    zoom: true,
                    width: fsSize.w || undefined,
                    height: fsSize.h || undefined,
                    useWorker: false,
                    fit: true,
                  }}
                />
              ) : (
                <div className="empty-state" role="status" aria-live="polite">
                  <div className="empty-icon" aria-hidden>
                    🗺️
                  </div>
                  <div className="empty-title">No graph to display</div>
                  <div className="empty-subtitle">
                    Run analysis to generate graphs, then pick a tab.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DotGraphViewer;
