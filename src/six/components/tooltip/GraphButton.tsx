// GraphButton.tsx - Updated to use the same tooltip format as executable options
import React from 'react';

interface GraphButtonProps {
  graphKey: string;
  isSelected: boolean;
  onClick: () => void;
  setPassedPrompt?: (prompt: string) => void;
}

// Graph-specific context that looks like intentional information
const GRAPH_CONTEXTS: { [key: string]: string } = {
  callgraph: `Here's some background about call graphs to help with your explanation:

Call graphs are directed graphs showing function calls in programs. The nodes represent functions and edges represent function calls between them. They're fundamental for dependency mapping, code optimization, and detecting unreachable code - parts of a program that can never be executed because there's no way to reach them through any function calls.`,

  icfg: `Here's some background about ICFG (Interprocedural Control Flow Graph) to help with your explanation:

ICFGs represent control flow that tracks execution order across multiple functions. Nodes are instructions/statements, edges are control-flow dependencies between nodes. The "interprocedural" aspect means it captures control flow across function boundaries. They provide a full program view, enable function dependency analysis, and help find dead code, unreachable paths, and detect infinite loops.`,

  svfg: `Here's some background about SVFG (Sparse Value Flow Graph) to help with your explanation:

SVFGs display def-use chains of pointers and objects, tracking how variables propagate throughout programs. Nodes are statements, parameters, or memory regions. Edges are value-flow dependencies between nodes. They're efficient because they reduce analysis overhead by focusing on key value interactions, track value flow across functions, and help pinpoint code bugs and data leaks.`,

  vfg: `Here's some background about VFG (Value Flow Graph) to help with your explanation:

VFGs represent the flow of values through program variables. Nodes are statements, parameters, or memory allocations. Edges are value-flow dependencies between variables and functions. They resolve both data and control dependencies and highlight how execution paths impact data usage. They're essential for detecting memory leaks and double-frees and support multithreaded analysis.`,

  pag: `Here's some background about PAG (Program Assignment Graph) to help with your explanation:

PAGs represent assignment constraints between program variables. Nodes are pointers/objects, edges are dependence/constraint relations between nodes. Unlike constraint graphs, PAGs are static and cannot be modified. They help analyse data dependencies within programs, define definition-use relations between variables, and are essential for identifying pointer relations and memory errors.`,

  ptacg: `Here's some background about PTACG (Points-to Analysis Call Graph) to help with your explanation:

PTACGs are enhanced call graphs with pointer analysis information, providing more precise function relationships than basic call graphs by combining function calls with pointer analysis data. They offer better precision in function relationship analysis and enable more sophisticated program analysis.`,

  tcg: `Here's some background about TCG (Thread Communication Graph) to help with your explanation:

TCGs show communication patterns and interactions in multi-threaded programs, visualizing how threads interact and communicate, including thread synchronization and data sharing patterns. They help understand multi-threaded program behavior and identify potential concurrency issues.`,
};

// Graph descriptions for tooltips
const GRAPH_DESCRIPTIONS: { [key: string]: string } = {
  callgraph:
    'Call Graph. Directed graph of function calls showing calling relationships between functions. Nodes = Functions, Edges = Function calls.',
  icfg: 'Interprocedural Control Flow Graph. Tracks execution order across multiple functions. Nodes = Instructions/Statements, Edges = Control-flow dependencies.',
  svfg: 'Sparse Value Flow Graph. Displays def-use chains of pointers and objects, tracking how variables propagate throughout the program.',
  vfg: 'Value Flow Graph. Represents the flow of values through program variables, resolving both data and control dependencies.',
  ptacg:
    'Points-to Analysis Call Graph. Call graph enhanced with pointer analysis information for more precise function relationships.',
  pag: 'Program Assignment Graph. Represents assignment constraints between program variables. Nodes = Pointers/objects, Edges = Dependence/constraint relations.',
  tcg: 'Thread Communication Graph. Shows communication patterns and interactions in multi-threaded programs.',
};

const GraphButton: React.FC<GraphButtonProps> = ({
  graphKey,
  isSelected,
  onClick,
  setPassedPrompt,
}) => {
  const displayName = graphKey.replace(/\.dot$/, '');
  const description = GRAPH_DESCRIPTIONS[displayName] || `Analysis graph: ${displayName}`;

  // Controlled tooltip visibility with small leave delay to allow moving cursor
  const [open, setOpen] = React.useState(false);
  const hideTimer = React.useRef<number | null>(null);
  const clearHideTimer = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };
  const onEnter = () => {
    clearHideTimer();
    setOpen(true);
  };
  const onLeave = () => {
    clearHideTimer();
    hideTimer.current = window.setTimeout(() => setOpen(false), 130);
  };

  // Handle Ask CodeGPT for graphs with simple instruction
  const handleGraphGPT = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (setPassedPrompt && displayName) {
      const graphContext = GRAPH_CONTEXTS[displayName] || '';

      // Simple approach: include context with instruction not to display it
      const prompt = `${graphContext}

Explain this graph visualization in detail. Focus on:
- What this graph represents and its structure (nodes and edges)
- How to interpret this visualization
- What insights you can gain from this graph
- When this graph is most useful in program analysis

Keep the explanation educational for students learning static analysis visualizations.`;

      setPassedPrompt(prompt);
    }
  };

  // Track onboarding-active changes via DOM observers so disabled updates after close
  const computeActive = () =>
    typeof document !== 'undefined' &&
    document.documentElement.dataset.onboardingActive === 'true' &&
    !!document.querySelector('.interactive-onboarding-overlay');
  const [onboardingActive, setOnboardingActive] = React.useState<boolean>(computeActive);
  React.useEffect(() => {
    const update = () => setOnboardingActive(computeActive());
    const moAttr = new MutationObserver(update);
    const moTree = new MutationObserver(update);
    try {
      moAttr.observe(document.documentElement, { attributes: true, attributeFilter: ['data-onboarding-active'] });
      moTree.observe(document.body, { childList: true, subtree: true });
    } catch {}
    return () => {
      moAttr.disconnect();
      moTree.disconnect();
    };
  }, []);

  // Close the small tooltip whenever onboarding is active
  React.useEffect(() => {
    if (onboardingActive) setOpen(false);
  }, [onboardingActive]);

  return (
    <div className="tooltip-container" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="tooltip-trigger">
        <button className={`graph-button ${isSelected ? 'selected' : ''}`} onClick={onClick} aria-describedby={`graph-tip-${displayName}`}>
          {displayName}
        </button>
      </div>
      {setPassedPrompt && !onboardingActive && (
        <div id={`graph-tip-${displayName}`} className={`tooltip-content ${open ? 'visible' : ''}`} onMouseEnter={onEnter} onMouseLeave={onLeave}>
          {description}
          <div className="tooltip-button-container">
            <button onClick={handleGraphGPT} className="tooltip-button" disabled={onboardingActive}>
              <span style={{ marginRight: '5px' }}>💡</span>
              Ask CodeGPT for more details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphButton;
