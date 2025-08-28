import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../../components/codeEditor/CodeEditor';
import DotGraphViewer from '../../components/output/dotGraphViewer/DotGraphViewer';
import SubmitCodeBar from '../../components/submitCode/submitCodeBar/SubmitCodeBar';
import OutputMenuBar from '../../components/output/outputMenuBar/OutputMenuBar';
import TerminalOutput from '../../components/output/terminalOutput/TerminalOutput';
import CodeGPT from '../../components/output/codeGPT/CodeGPT';
import LLVMIR from '../../components/output/LLVMIR/LLVMIR';
import RealTerminal from '../../components/output/realTerminal/RealTerminal';
import submitCodeFetch from '../../api';
import NavBar from '../../components/navBar/Navbar';
import SettingsModal from '../../components/settingsModal/SettingsModal';
import { useToast } from '../../hooks/useToast';
import './graphsPage.css';
import { llvmHighlight } from '../../components/output/LLVMIR/llvmIRIdentifier';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import ShareLZSettingsModal from '../../components/shareLZSettingsModal/shareLZSettingsModal';
import SessionsSidebar from '../../components/multiSession/sessionsSidebar/sessionsSidebar';
import SessionManager, { Session } from '../../components/multiSession/sessionManager';

type OutputType = 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output' | 'Terminal';

interface DecompressedSettings {
  code?: string;
  selectedCompileOptions?: compileOption[];
  selectedExecutableOptions?: string[];
  sessionId?: string;
}
interface compileOption {
  value: string;
  label: string;
}

// Fallback default code for empty sessions (matches SessionManager)
const DEFAULT_CODE = `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int size;
} IntArray;

IntArray* createIntArray(int size) {
    IntArray *arr = malloc(sizeof(IntArray));
    arr->size = size;
    arr->data = malloc(size * sizeof(int));
    for (int i = 0; i < size; i++) {
        arr->data[i] = i; // Initialize the array
    }
    return arr;
}

void useIntArray(IntArray *arr) {
    for (int i = 0; i < arr->size; i++) {
        printf("%d ", arr->data[i]);
    }
    printf("\\n");
}

int main() {
    IntArray *array1 = createIntArray(5);
    IntArray *array2 = createIntArray(10);

    useIntArray(array1);
    useIntArray(array2);

    return 0;
}`;

const compileOptions = [
  { value: '-g', label: '-g' },
  { value: '-c', label: '-c' },
  { value: '-S', label: '-S' },
  { value: '-fno-discard-value-names', label: '-fno-discard-value-names' },
  { value: '-emit-llvm', label: '-emit-llvm' },
  { value: '-E', label: '-E' },
  { value: '-v', label: '-v' },
  { value: '-pipe', label: '-pipe' },
  { value: '--help', label: '--help' },
];

const executableOptions = [
  { value: 'mta', label: 'mta (Multi-Thread Analysis)' },
  { value: 'saber', label: 'saber (Memory Leak Detector)' },
  { value: 'ae -overflow', label: 'ae (Buffer Overflow Detector)' },
  { value: 'ae -null-deref', label: 'ae (Null Dereference Detector)' },
  { value: 'wpa', label: 'wpa (Whole Program Pointer Analysis)' },
  { value: 'dvf', label: 'dvf (On-Demand Value Flow Analysis)' },
];

function GraphsPage() {
  // Initialize toast hook
  const { showError, showSuccess } = useToast();
  // Add session management state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { sessionId: routeSessionId } = useParams();
  const navigate = useNavigate();

  const [codeError, setCodeError] = useState([]);
  const [currCodeLineNum, setCurrCodeLineNum] = useState(0);
  const [currentOutput, setCurrentOutput] = useState<OutputType>('Graph');
  const [selectedCompileOptions, setSelectedCompileOptions] = useState([
    compileOptions[0],
    compileOptions[1],
    compileOptions[2],
    compileOptions[3],
    compileOptions[4],
  ]);
  const [selectedExecutableOptions, setSelectedExecutableOptions] = useState<string[]>([]);

  const [lineNumDetails, setLineNumDetails] = useState<{
    [key: string]: { nodeOrllvm: string[]; colour: string };
  }>({});
  const [code, setCode] = useState(DEFAULT_CODE);
  const [lineNumToHighlight, setlineNumToHighlight] = useState<Set<number>>(new Set());
  const setlineNumToHighlightGuard = useCallback((next: Set<number>) => {
    setlineNumToHighlight((prev) => {
      if (prev.size === next.size) {
        let same = true;
        for (const v of Array.from(next)) {
          if (!prev.has(v)) {
            same = false;
            break;
          }
        }
        if (same) return prev;
      }
      return next;
    });
  }, []);
  const [terminalOutputString, setTerminalOutputString] = useState(
    'Run the code to see the terminal output here'
  );
  const [llvmIRString, setllvmIRString] = useState('Run the code to see the LLVM IR of your here');
  const [graphs, setGraphs] = useState({});
  const [savedMessages, setSavedMessages] = useState<{ role: string; content: string }[]>([]);
  const [passedPrompt, setPassedPrompt] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [codeFontSize, setCodeFontSize] = useState(16);
  const [llvmIRFontSize, setLLVMIRFontSize] = useState(16);
  const [terminalOutputFontSize, setTerminalOutputFontSize] = useState(16);

  const [tabPositions, setTabPositions] = useState<Record<OutputType, string>>({
    Graph: 'main',
    'Terminal Output': 'main',
    CodeGPT: 'main',
    LLVMIR: 'main',
    Terminal: 'main', // ✅ Add this
  });

  const createLZStringUrl = useCallback(() => {
    const baseUrl = window.location.origin;

    // Create a shareable settings object for the current session only
    const savedSettings: DecompressedSettings = {
      sessionId: currentSessionId || undefined,
    };

    // Compress the settings
    const compressed = compressToEncodedURIComponent(JSON.stringify(savedSettings));

    // Return a URL that points directly to the session
    return `${baseUrl}/session/${currentSessionId}?data=${compressed}`;
  }, [currentSessionId]);

  const saveCurrentSession = useCallback(() => {
    if (currentSessionId) {
      SessionManager.updateSession(currentSessionId, {
        code,
        selectedCompileOptions,
        selectedExecutableOptions,
        lineNumDetails,
        graphs,
        terminalOutput: terminalOutputString,
        llvmIR: llvmIRString,
        savedMessages, // Add this line,
        currentOutput,
        lineNumToHighlight: Array.from(lineNumToHighlight),
        tabPositions,
      });
    }
  }, [
    currentSessionId,
    code,
    selectedCompileOptions,
    selectedExecutableOptions,
    lineNumDetails,
    graphs,
    terminalOutputString,
    llvmIRString,
    savedMessages,
    currentOutput,
    lineNumToHighlight,
    tabPositions,
  ]);

  // Session Management Functions
  const loadSession = useCallback((session: Session) => {
    setCode(session.code && session.code.trim() !== '' ? session.code : DEFAULT_CODE);
    setSelectedCompileOptions(session.selectedCompileOptions);
    setSelectedExecutableOptions(session.selectedExecutableOptions || []);
    setLineNumDetails(session.lineNumDetails);
    setGraphs(session.graphs);
    setTerminalOutputString(session.terminalOutput);
    setllvmIRString(session.llvmIR);
    setSavedMessages(session.savedMessages || []); // Add this line
    setCurrentOutput(session.currentOutput || 'Graph');
    setlineNumToHighlight(new Set(session.lineNumToHighlight || []));
    setTabPositions(
      session.tabPositions || {
        Graph: 'main',
        'Terminal Output': 'main',
        CodeGPT: 'main',
        LLVMIR: 'main',
        Terminal: 'main',
      }
    );
  }, []);

  const loadSessions = useCallback(() => {
    const loadedSessions = SessionManager.getSessions();
    setSessions(loadedSessions);

    if (loadedSessions.length > 0) {
      // If the most recent session has empty code, start a fresh default session
      const first = loadedSessions[0];
      if (!first.code || first.code.trim() === '') {
        const fresh = SessionManager.createSession();
        setSessions([fresh, ...loadedSessions]);
        setCurrentSessionId(fresh.id);
        loadSession(fresh);
        return;
      }
      setCurrentSessionId(loadedSessions[0].id);
      loadSession(loadedSessions[0]);
    } else {
      // Create a new session if none exist
      const newSession = SessionManager.createSession();
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
      loadSession(newSession);
    }
  }, [setSessions, loadSession]);

  // Load the session specified in the URL (only when a route param exists)
  const lastRouteRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!routeSessionId) return; // Defer to loadSessions for default case
    if (lastRouteRef.current === routeSessionId) return;
    lastRouteRef.current = routeSessionId;

    const loadedSessions = SessionManager.getSessions();
    setSessions(loadedSessions);

    const sessionToLoad = SessionManager.getSession(routeSessionId);
    if (sessionToLoad) {
      setCurrentSessionId(routeSessionId);
      loadSession(sessionToLoad);
    } else {
      navigate('/', { replace: true });
    }
  }, [routeSessionId, navigate, loadSession]);

  const inlineStyles = {
    container: {
      display: 'flex',
    },
  };

  const [isCodeLeft, setIsCodeLeft] = useState(true);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [draggedTab, setDraggedTab] = useState<OutputType | null>(null);

  // Add new state for resizable panes
  const [leftWidth, setLeftWidth] = useState(57); // percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Handling resize functionality
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;

    // Add resizing class to container
    if (containerRef.current) {
      containerRef.current.classList.add('resizing');
    }

    // Add active class to resizer
    if (resizerRef.current) {
      resizerRef.current.classList.add('resizing');
    }

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  };

  const resize = (e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    // Get container dimensions
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;

    // Calculate percentage with respect to the container
    let newLeftWidth = ((e.clientX - containerRect.left) / containerWidth) * 100;

    // Limit the minimum size of either pane to 20%
    newLeftWidth = Math.max(20, Math.min(80, newLeftWidth));

    // Set the state for the left container width
    setLeftWidth(newLeftWidth);

    // Important: Directly update container widths during drag for smoother experience
    const codeContainer = document.getElementById('graph-page-code-container');
    const outputContainer = document.getElementById('graph-page-output-container');

    if (codeContainer && outputContainer) {
      if (isCodeLeft) {
        codeContainer.style.width = `${newLeftWidth}%`;
        outputContainer.style.width = `${100 - newLeftWidth}%`;
      } else {
        codeContainer.style.width = `${100 - newLeftWidth}%`;
        outputContainer.style.width = `${newLeftWidth}%`;
      }
    }

    // Update resizer position
    if (resizerRef.current) {
      resizerRef.current.style.left = `calc(${newLeftWidth}% - 4px)`;
    }
  };

  const stopResize = () => {
    isDraggingRef.current = false;

    // Remove resizing class from container
    if (containerRef.current) {
      containerRef.current.classList.remove('resizing');
    }

    // Remove active class from resizer
    if (resizerRef.current) {
      resizerRef.current.classList.remove('resizing');
    }

    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  };

  const handleDragStart = (e: React.DragEvent<HTMLElement>, element: string | OutputType) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('draggedItem', String(element));

    if (typeof element === 'string') {
      setDraggedElement(element);
    } else {
      setDraggedTab(element);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const target = e.currentTarget.id;
    if (draggedElement && draggedElement !== target) {
      if (
        (draggedElement === 'code' && target === 'graph-page-output-container') ||
        (draggedElement === 'output' && target === 'graph-page-code-container')
      ) {
        setIsCodeLeft(!isCodeLeft);
      }
      setDraggedElement(null);
    } else if (draggedTab) {
      setTabPositions((prev) => ({
        ...prev,
        [draggedTab]: target === 'third-dropzone' ? 'third' : 'main',
      }));
      setDraggedTab(null);
    }
  };

  // Initial load of sessions (once)
  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save at interval without retriggering loadSessions
  const saveRef = useRef(saveCurrentSession);
  useEffect(() => {
    saveRef.current = saveCurrentSession;
  }, [saveCurrentSession]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (saveRef.current) saveRef.current();
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Save session when code or options change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveCurrentSession();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [code, selectedCompileOptions, selectedExecutableOptions, saveCurrentSession]);

  const renderComponent = () => {
    switch (currentOutput) {
      case 'Graph':
        return (
          <DotGraphViewer
            key={`graph-${currentSessionId}`} // Add this key
            setlineNumToHighlight={setlineNumToHighlightGuard}
            graphObj={graphs}
            setLineNumDetails={setLineNumDetails}
            lineNumDetails={lineNumDetails}
            currCodeLineNum={currCodeLineNum}
            code={code}
            setPassedPrompt={setPassedPrompt}
          />
        );
      case 'Terminal Output':
        return (
          <TerminalOutput
            key={`terminal-${currentSessionId}`}
            terminalOutputString={terminalOutputString}
            externalFontSize={terminalOutputFontSize}
          />
        );
      case 'CodeGPT':
        return (
          <CodeGPT
            key={`codegpt-${currentSessionId}`} // Add this key to force re-render
            code={code}
            graphs={graphs}
            terminalOutput={terminalOutputString}
            llvmIR={llvmIRString}
            savedMessages={savedMessages}
            onSaveMessages={setSavedMessages}
            passedPrompt={passedPrompt}
          />
        );
      case 'LLVMIR':
        return <LLVMIR LLVMIRString={llvmIRString} externalFontSize={llvmIRFontSize} />;
      case 'Terminal':
        return <RealTerminal key={`realterminal-${currentSessionId}`} />;

      default:
        return null;
    }
  };

  useEffect(() => {
    if (passedPrompt !== '') {
      setCurrentOutput('CodeGPT');

      // Reset passedPrompt after it's been used
      setTimeout(() => {
        setPassedPrompt('');
      }, 100);
    }
  }, [passedPrompt]);

  const submitCode = async () => {
    const selectedCompileOptionString = selectedCompileOptions
      .map((option) => option.value)
      .join(' ');
    const selectedExecutableOptionsList = selectedExecutableOptions.map((option) => option.value);

    try {
      const response = await submitCodeFetch(
        code,
        selectedCompileOptionString,
        selectedExecutableOptionsList
      );

      if (!response) {
        const errorMessage = 'No response received from API';
        setTerminalOutputString('Error: ' + errorMessage);
        showError(errorMessage);
        return;
      }

      // Check both lowercase and uppercase field names for compatibility
      const responseName = response.name || response.Name;
      const responseGraphs = response.graphs || response.Graphs;
      const responseLLVM = response.llvm || response.Llvm;
      const responseOutput = response.output || response.Output;
      const responseError = response.error || response.Error;
      console.log('Response is: ', response);

      if (responseName) {
        if (responseName == 'Resultant Graphs') {
          const respGraphs = responseGraphs || [];

          const graphObj = {};
          if (Array.isArray(respGraphs) && respGraphs.length > 0) {
            respGraphs.forEach((graph) => {
              const graphName = graph.name || graph.Name;
              const graphData = graph.graph || graph.Graph;
              if (graphName && graphData) {
                graphObj[graphName] = graphData;
              }
            });
          } else {
            // No graphs generated
          }

          setGraphs(graphObj);
          setllvmIRString(responseLLVM || '');
          setTerminalOutputString(responseOutput || '');

          // Merge in LLVM-based highlights (e.g., mapping C return lines to LLVM IR ret lines)
          try {
            const llvmMapping = llvmHighlight(code.split('\n'), (responseLLVM || '').split('\n'));
            setLineNumDetails((prev) => ({ ...prev, ...llvmMapping }));
          } catch (_e) {
            // No-op: if highlighting fails, continue without blocking
          }

          setCodeError(formatErrorLogs(responseError || ''));
          // Show success message if code processed successfully
          showSuccess('Code processed successfully!');

          // Save session after code submission
          saveCurrentSession();
        } else if (responseName == 'Clang Error') {
          const errorMessage = responseError || 'Unknown error';
          setTerminalOutputString(errorMessage);
          setCodeError(formatClangErrors(errorMessage));
          showError('Compilation failed: ' + errorMessage.split('\n')[0]); // Show first line of error
        }
      } else {
        const errorMessage = 'Invalid response from API';
        setTerminalOutputString('Error: ' + errorMessage);
        showError(errorMessage);
      }
    } catch (error) {
      const err = error as any;
      const errorMessage = (err && err.message) || 'Failed to submit code';
      setTerminalOutputString(`Error: ${errorMessage}`);
      showError('Backend Error: ' + errorMessage);
    }
  };

  // It formats the error messages it receives from clang
  // Function is used if it did not pass clang
  const formatClangErrors = (stdErr: string) => {
    const errorList = stdErr.split('\n');

    let errorMsg = '';
    const regex = /example.c:(\d+):(\d+)/;
    const formattedErrors = [];
    // The last element of the array is sentence on how many errors and warnings were generated
    for (let i = 0; i < errorList.length - 1; i++) {
      const match = errorList[i].match(regex);
      if (match) {
        if (errorMsg !== '') {
          formattedErrors.push(errorMsg);
        }
        errorMsg = 'CLANG:\n' + errorList[i];
      } else {
        errorMsg = errorMsg + '\n' + errorList[i];
      }
    }
    if (errorMsg !== '') {
      formattedErrors.push(errorMsg);
    }

    return formattedErrors;
  };

  // It formats the Error messages it receives
  // This is used when the code is compiled by clang
  const formatErrorLogs = (stdErr: string) => {
    console.log(stdErr);
    const errorList = stdErr.split('\n');
    const formattedErrors = [];
    let i = 0;
    let numOverflow = 0;
    while (i < errorList.length) {
      // Enhanced memory leak detection patterns
      if (
        errorList[i].includes('NeverFree') ||
        errorList[i].includes('memory leak') ||
        errorList[i].includes('Memory leak') ||
        errorList[i].includes('MEMORY LEAK') ||
        errorList[i].includes('leak detected') ||
        errorList[i].includes('Leak detected') ||
        errorList[i].includes('never freed') ||
        errorList[i].includes('Never freed') ||
        (errorList[i].includes('malloc') && errorList[i].includes('not freed')) ||
        (errorList[i].includes('alloc') && errorList[i].includes('leak')) ||
        (errorList[i].includes('saber') && errorList[i].includes('leak'))
      ) {
        formattedErrors.push('MEMORY LEAK: ' + errorList[i]);
      } else if (errorList[i].includes('######################Buffer Overflow')) {
        numOverflow = parseInt(errorList[i].match(/\d+/)[0], 10);
      } else if (
        errorList[i].includes('---------------------------------------------') &&
        numOverflow > 0
      ) {
        formattedErrors.push('BUFFER OVERFLOW: ' + errorList[i + 1] + errorList[i + 2]);
        i = i + 2;
        numOverflow--;
      }

      i++;
    }
    return formattedErrors;
  };

  const resetDefault = () => {
    setSelectedCompileOptions([
      compileOptions[0],
      compileOptions[1],
      compileOptions[2],
      compileOptions[3],
      compileOptions[4],
    ]);
    setSelectedExecutableOptions([]);
  };

  // Add this to your useEffect that handles URL parameters
  const didParseRef1 = useRef(false);
  useEffect(() => {
    if (didParseRef1.current) return;
    didParseRef1.current = true;
    const urlParams = new URLSearchParams(window.location.search);
    let compressedFromURL = urlParams.get('data');

    if (compressedFromURL) {
      let decompressedSettings: DecompressedSettings = {};

      try {
        if (compressedFromURL.startsWith('${')) {
          compressedFromURL = compressedFromURL.replace('${', '');
        }

        const decompressedSettingsString = decompressFromEncodedURIComponent(compressedFromURL);
        decompressedSettings = JSON.parse(decompressedSettingsString);

        // Check if there's a session ID in the URL data
        if (decompressedSettings.sessionId) {
          // Try to load the specified session
          const session = SessionManager.getSession(decompressedSettings.sessionId);

          if (session) {
            // If the session exists, load it
            setCurrentSessionId(decompressedSettings.sessionId);
            loadSession(session);
            // Navigate to the session URL to maintain consistent state
            navigate(`/session/${decompressedSettings.sessionId}`, { replace: true });
            return; // Exit early since we've loaded a session
          }
        }

        // If no session ID or session  found, update the current session with the URL data
        if (decompressedSettings.code) {
          setCode(decompressedSettings.code);
        }

        if (decompressedSettings.selectedCompileOptions) {
          setSelectedCompileOptions(decompressedSettings.selectedCompileOptions);
        }

        if (decompressedSettings.selectedExecutableOptions) {
          setSelectedExecutableOptions(decompressedSettings.selectedExecutableOptions);
        }

        // Save these changes to the current session
        if (currentSessionId) {
          saveCurrentSession();
        }
      } catch (error) {
        // Error parsing URL data - silently ignore
      }
    }
    // Intentional one-time parse of URL params on first mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const didParseRef2 = useRef(false);
  useEffect(() => {
    if (didParseRef2.current) return;
    didParseRef2.current = true;
    const urlParams = new URLSearchParams(window.location.search);
    let compressedFromURL = urlParams.get('data');

    if (compressedFromURL) {
      try {
        if (compressedFromURL.startsWith('${')) {
          compressedFromURL = compressedFromURL.replace('${', '');
        }

        const decompressedSettingsString = decompressFromEncodedURIComponent(compressedFromURL);
        const decompressedSettings: DecompressedSettings = JSON.parse(decompressedSettingsString);

        // If the URL contains a session ID, load that specific session
        if (decompressedSettings.sessionId) {
          const sessionId = decompressedSettings.sessionId;
          const session = SessionManager.getSession(sessionId);

          if (session) {
            // If we found the session, set it as current and load it
            setCurrentSessionId(sessionId);
            loadSession(session);

            // Update the URL to point to this session without the query parameter
            const newUrl = `${window.location.origin}/session/${sessionId}`;
            window.history.replaceState({}, '', newUrl);
          } else {
            // Session not found, load the first available session
            const availableSessions = SessionManager.getSessions();
            if (availableSessions.length > 0) {
              setCurrentSessionId(availableSessions[0].id);
              loadSession(availableSessions[0]);
              // Update URL
              const newUrl = `${window.location.origin}/session/${availableSessions[0].id}`;
              window.history.replaceState({}, '', newUrl);
            }
          }
        } else {
          // If no session ID in URL but there are other settings, apply them to current session
          if (
            decompressedSettings.code ||
            decompressedSettings.selectedCompileOptions ||
            decompressedSettings.selectedExecutableOptions
          ) {
            if (decompressedSettings.code) {
              setCode(decompressedSettings.code);
            }

            if (decompressedSettings.selectedCompileOptions) {
              setSelectedCompileOptions(decompressedSettings.selectedCompileOptions);
            }

            if (decompressedSettings.selectedExecutableOptions) {
              setSelectedExecutableOptions(decompressedSettings.selectedExecutableOptions);
            }

            // Save these changes to current session
            if (currentSessionId) {
              saveCurrentSession();
            }
          }
        }
      } catch (error) {
        // Error parsing URL data - silently ignore
      }
    }
  }, [currentSessionId, loadSession, saveCurrentSession]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSessionSelect = (sessionId: string) => {
    saveCurrentSession();
    navigate(`/session/${sessionId}`, { replace: true });
  };

  const handleNewSession = () => {
    // Save current session before creating a new one
    saveCurrentSession();

    const newSession = SessionManager.createSession();
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    loadSession(newSession);
  };

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    const updatedSession = SessionManager.updateSession(sessionId, { title: newTitle });
    if (updatedSession) {
      setSessions((prevSessions) =>
        prevSessions.map((s) => (s.id === sessionId ? updatedSession : s))
      );
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    if (sessions.length <= 1) {
      // Don't delete the last session
      alert('Cannot delete the last project. Create a new one first.');
      return;
    }

    SessionManager.deleteSession(sessionId);
    const updatedSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(updatedSessions);

    // If the current session is deleted, load the first available session
    if (sessionId === currentSessionId && updatedSessions.length > 0) {
      setCurrentSessionId(updatedSessions[0].id);
      loadSession(updatedSessions[0]);
    }
  };

  const [openShareModal, setOpenShareModal] = React.useState(false);
  const handleOpenShareModal = () => setOpenShareModal(true);
  const handleCloseShareModal = () => setOpenShareModal(false);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    if (openShareModal === true) {
      setShareLink(createLZStringUrl());
    }
  }, [createLZStringUrl, openShareModal]);

  const handleShareSession = (sessionId: string) => {
    // First ensure all sessions are saved
    saveCurrentSession();

    // Get the base URL of your application
    const baseUrl = window.location.origin;

    // Create a shareable settings object for this specific session
    const shareSettings: DecompressedSettings = {
      sessionId: sessionId, // Only include the session ID
    };

    // Compress the settings
    const compressed = compressToEncodedURIComponent(JSON.stringify(shareSettings));

    // Create a URL that points directly to this session
    setShareLink(`${baseUrl}/session/${sessionId}?data=${compressed}`);
    handleOpenShareModal();
  };

  return (
    <>
      <ShareLZSettingsModal
        open={openShareModal}
        handleClose={handleCloseShareModal}
        shareLink={shareLink}
      />
      <NavBar
        openShare={handleOpenShareModal}
        setCode={setCode}
        code={code}
        openSettings={() => setSettingsOpen(true)}
      />
      <SettingsModal
        open={settingsOpen}
        handleClose={() => setSettingsOpen(false)}
        codeFontSize={codeFontSize}
        setCodeFontSize={setCodeFontSize}
        llvmIRFontSize={llvmIRFontSize}
        setLLVMIRFontSize={setLLVMIRFontSize}
        terminalOutputFontSize={terminalOutputFontSize}
        setTerminalOutputFontSize={setTerminalOutputFontSize}
      />
      <div className="app-layout">
        {/* Sessions Sidebar */}
        <SessionsSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
          onShareSession={handleShareSession}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div id="graph-page-container" ref={containerRef} style={inlineStyles.container}>
          <div
            id="graph-page-code-container"
            draggable
            onDragStart={(e) => handleDragStart(e, 'code')}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={isCodeLeft ? 'left' : 'right'}
            style={{ width: `${isCodeLeft ? leftWidth : 100 - leftWidth}%` }}
          >
            <SubmitCodeBar
              submitEvent={submitCode}
              resetCompileOptions={resetDefault}
              compileOptions={compileOptions}
              selectedCompileOptions={selectedCompileOptions}
              setSelectedCompileOptions={setSelectedCompileOptions}
              executableOptions={executableOptions}
              selectedExecutableOptions={selectedExecutableOptions}
              setSelectedExecutableOptions={setSelectedExecutableOptions}
              setPassedPrompt={setPassedPrompt}
            />
            <CodeEditor
              code={code}
              setCode={setCode}
              lineNumToHighlight={lineNumToHighlight}
              lineNumDetails={lineNumDetails}
              setCurrCodeLineNum={setCurrCodeLineNum}
              codeError={codeError}
              setPassedPrompt={setPassedPrompt}
              externalFontSize={codeFontSize}
              onExternalFontSizeChange={(size) => setCodeFontSize(size)}
            />
          </div>
          {/* Resizer element */}
          <div
            className="resizer"
            ref={resizerRef}
            onMouseDown={startResize}
            style={{
              left: `calc(${leftWidth}% - 4px)` /* Position exactly at the border */,
            }}
          />
          <div
            id="graph-page-output-container"
            draggable
            onDragStart={(e) => handleDragStart(e, 'output')}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={isCodeLeft ? 'right' : 'left'}
            style={{ width: `${isCodeLeft ? 100 - leftWidth : leftWidth}%` }}
          >
            <OutputMenuBar
              currentOutput={currentOutput}
              setCurrentOutput={setCurrentOutput}
              onDragStartTab={(tab, e) => handleDragStart(e, tab)}
            />
            <div
              style={{ flexGrow: 1 }}
              onDrop={(e) => handleDrop(e)}
              onDragOver={(e) => e.preventDefault()}
            >
              {renderComponent()}
            </div>

            {/* Third Window (will appear when a tab is dragged into it) */}
            {Object.values(tabPositions).includes('third') && (
              <div
                id="graph-page-output-container"
                draggable
                onDragStart={(e) => handleDragStart(e, 'output')}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={isCodeLeft ? 'right' : 'left'}
                style={{ width: '50%', display: 'flex', flexDirection: 'column' }}
              >
                {Object.entries(tabPositions).map(([tab, position]) =>
                  position === 'third' ? (
                    <div key={tab} draggable>
                      {renderComponent()}
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GraphsPage;
