import React, { useRef, useEffect, useState, useCallback } from 'react';
import Editor, { OnMount, useMonaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import './styles.css';
import FontSizeMenu from '../fontSizeMenu/FontSizeMenu';
import LanguageSelector from '../languageSelector/LanguageSelector';
import DefaultCodeModal from '../defaultCodeModal/DefaultCodeModal';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  lineNumToHighlight: Set<number>;
  lineNumDetails: { [key: string]: { nodeOrllvm: string[]; colour: string } };
  setCurrCodeLineNum: (lineNum: number) => void;
  codeError: string[];
  setPassedPrompt: (prompt: string) => void;
  externalFontSize?: number;
  onExternalFontSizeChange?: (size: number) => void;
  lang: string;
  setLang: (lang: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  lineNumToHighlight,
  lineNumDetails,
  setCurrCodeLineNum,
  codeError,
  setPassedPrompt,
  externalFontSize,
  onExternalFontSizeChange,
  lang,
  setLang,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoInstance = useMonaco();

  const [showDefaultModal, setShowDefaultModal] = useState(false);
  const openDefaultModal = () => setShowDefaultModal(true);
  const closeDefaultModal = () => setShowDefaultModal(false);

  const [fontSize, setFontSize] = useState(16);
  const [useLocalFontSize, setUseLocalFontSize] = useState(false);
  useState<monaco.editor.IEditorDecorationsCollection | null>(null);
  const decorationsRef = useRef<monaco.editor.IEditorDecorationsCollection | null>(null);
  const [editorKey, setEditorKey] = useState(0); // State variable for the key

  // This ref is used to ensure that only one Ask codeGPT action appears for quickfix
  // We clear it before adding new quickFix ask codeGPT action
  const codeActionProviderRef = useRef<monaco.IDisposable | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    const model = monaco.editor.createModel(code, lang, monaco.Uri.parse('inmemory://test_script'));
    editor.setModel(model);
    decorationsRef.current = editor.createDecorationsCollection();
    editor.updateOptions({
      fontSize: useLocalFontSize ? fontSize : externalFontSize ?? fontSize,
      renderValidationDecorations: 'on',
    });
    monaco.languages.register({ id: lang });

    monaco.languages.setLanguageConfiguration(lang, {});

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setCode(value);
    });

    // Sets the current line number when the cursor position changes
    editor.onDidChangeCursorPosition((event) => {
      const lineNum = event.position.lineNumber;
      setCurrCodeLineNum(lineNum);
    });
    const markers = applyMarkers();
    monaco.editor.setModelMarkers(model, lang, markers);

    // Register the ask code gpt command
    monaco.editor.registerCommand('askCodeGPTCommand', (_accessor, ...args) => {
      const [uri, range, problemMessage, lineCode] = args;
      askCodeGPT(uri, range, problemMessage, lineCode);
    });

    // Dispose of the previous code action provider if it exists
    // This prevents adding multiple ask codeGPT action into quick fix
    if (codeActionProviderRef.current) {
      codeActionProviderRef.current.dispose();
    }

    codeActionProviderRef.current = monaco.languages.registerCodeActionProvider(lang, {
      provideCodeActions: (model, range) => {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        const relevantMarker = markers.find(
          (marker) => marker.startLineNumber === range.startLineNumber
        );

        if (!relevantMarker) {
          return {
            actions: [],
            dispose: () => {
              /* noop */
            },
          };
        }
        const quickFix = {
          title: 'Ask CodeGPT',
          diagnostics: [relevantMarker],
          kind: 'quickfix',
          command: {
            id: 'askCodeGPTCommand',
            title: 'Ask CodeGPT',
            arguments: [
              model.uri,
              range,
              relevantMarker.message,
              model.getLineContent(relevantMarker.startLineNumber),
            ], // Pass message and line code
          },
          isPreferred: true,
        };

        return {
          actions: [quickFix],
          dispose: () => {
            /* noop */
          },
        };
      },
    });
  };

  const askCodeGPT = (
    _uri: monaco.Uri,
    _range: monaco.Range,
    problemMessage: string,
    lineCode: string
  ) => {
    // Additional logic for handling the problem message and code line
    let prompt = '```' + code + '```';
    if (problemMessage.includes('CLANG:')) {
      prompt =
        prompt +
        '\n In my code, I received an error message of "' +
        problemMessage +
        '" for the line of code ```' +
        lineCode +
        ' ```when compiling my code with clang. ';
    } else if (problemMessage.includes('MEMORY LEAK:')) {
      prompt =
        prompt +
        '\n In my code, I received a memory leak error message of "' +
        problemMessage +
        '" for the line of code ```' +
        lineCode +
        '```. ';
    } else if (problemMessage.includes('BUFFER OVERFLOW:')) {
      prompt =
        prompt +
        '\n In my code, I received a buffer overflow message of "' +
        problemMessage +
        '" for the line of code ```' +
        lineCode +
        '```. ';
    } else {
      prompt =
        prompt +
        '\n In my code, I received an error message of "' +
        problemMessage +
        '" for the line of code ``` ' +
        lineCode +
        '```. ';
    }
    prompt = prompt + 'Can you explain why I have this error and how to solve this issue?';
    setPassedPrompt(prompt);
  };
  // Adds the red squigly line on the code editor indicating an error or warning to line of code
  const applyMarkers = useCallback((): monaco.editor.IMarkerData[] => {
    monaco.languages.register({ id: lang });

    monaco.languages.setLanguageConfiguration(lang, {
      // Ensure C language supports diagnostics markers
    });
    if (editorRef.current && codeError.length !== 0) {
      const model = editorRef.current.getModel();
      // Clear any previous markers
      if (model) {
        monaco.editor.setModelMarkers(model, lang, []);
      }

      const lnRegexcl = /ln:\s*(\d+)\s*cl:\s*(\d+)/;
      const quotedRegex = /"ln":\s*(\d+),\s*"cl":\s*(\d+)/;
      const clangRegex = /example.c:(\d+):(\d+)/;
      const markers: monaco.editor.IMarkerData[] = [];
      codeError.map((error) => {
        let match: string[] | null;
        let lnNum = 0;
        let clNum = 1;
        match = error.match(lnRegexcl);
        if (match) {
          lnNum = parseInt(match[1], 10);
          clNum = parseInt(match[2], 10);
        }

        match = error.match(quotedRegex);
        if (match) {
          lnNum = parseInt(match[1], 10);
          clNum = parseInt(match[2], 10);
        }
        match = error.match(clangRegex);
        if (match) {
          lnNum = parseInt(match[1], 10);
          clNum = parseInt(match[2], 10);
        }

        if (lnNum !== 0 && model) {
          const lineCount = model.getLineCount();
          if (lnNum < 1 || lnNum > lineCount) {
            return; // Skip invalid line numbers
          }
          const lineLength = model.getLineLength(lnNum);
          const safeStartColumn = Math.max(1, Math.min(clNum, lineLength));
          const safeEndColumn = lineLength + 1;
          markers.push({
            code: undefined,
            source: lang,
            startLineNumber: lnNum,
            startColumn: safeStartColumn,
            endLineNumber: lnNum,
            endColumn: safeEndColumn,
            message: error,
            severity: monaco.MarkerSeverity.Error,
          });
        }
      });
      return markers;
    }
    return [];
  }, [codeError]);

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        const markers = applyMarkers();
        monaco.editor.setModelMarkers(model, lang, markers);
        setEditorKey((prevKey) => prevKey + 1);
      }
    }
  }, [codeError, applyMarkers]);

  useEffect(() => {
    if (!monacoInstance || !editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    // change model language (this updates syntax highlighting)
    monacoInstance.editor.setModelLanguage(model, lang);

    // re-register / update any language-specific config you rely on
    try {
      monacoInstance.languages.register({ id: lang });
      monacoInstance.languages.setLanguageConfiguration(lang, {});
    } catch {
      // ignore if registration fails (some languages are built-in)
    }

    // If you have code-action providers or diagnostics registered per-language,
    // you should re-register/refresh them here (dispose old providers if needed).
    // e.g. dispose existing provider refs and create new ones bound to `monacoLang`.
  }, [lang, monacoInstance]);

  // Used to detect for any changes in code
  // This is needed for when lz string compression calls setcode
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model && model.getValue() !== code) {
        model.setValue(code);
        setEditorKey((prevKey) => prevKey + 1);
      }
    }
  }, [code]);

  useEffect(() => {
    if (decorationsRef !== null && decorationsRef.current !== null) {
      const model = editorRef.current?.getModel();
      const lineCount = model?.getLineCount() ?? 0;
      const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];

      for (const lineNum in lineNumDetails) {
        const colour = lineNumDetails[lineNum]['colour'].slice(1).toLowerCase();
        let decoration: monaco.editor.IModelDeltaDecoration;
        const parsedLineNum = parseInt(lineNum);
        if (!Number.isFinite(parsedLineNum) || parsedLineNum < 1 || parsedLineNum > lineCount) {
          continue;
        }
        if (lineNumToHighlight.has(parsedLineNum)) {
          decoration = {
            range: new monaco.Range(parsedLineNum, 1, parsedLineNum, 1),
            options: {
              isWholeLine: true,
              inlineClassName: `line-decoration-text-${colour}`,
            },
          };
          if (editorRef.current) {
            editorRef.current.revealLine(parsedLineNum);
          }
        } else {
          decoration = {
            range: new monaco.Range(parsedLineNum, 1, parsedLineNum, 1),
            options: {
              isWholeLine: true,
              inlineClassName: `line-decoration-${colour}`,
            },
          };
        }

        newDecorations.push(decoration);
      }
      decorationsRef.current?.set(newDecorations);
    }
  }, [lineNumToHighlight, lineNumDetails]);

  useEffect(() => {
    if (decorationsRef !== null && decorationsRef.current !== null) {
      const model = editorRef.current?.getModel();
      const lineCount = model?.getLineCount() ?? 0;
      const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];

      for (const lineNum in lineNumDetails) {
        const colour = lineNumDetails[lineNum]['colour'].slice(1).toLowerCase();
        const parsedLineNum = parseInt(lineNum);
        if (!Number.isFinite(parsedLineNum) || parsedLineNum < 1 || parsedLineNum > lineCount) {
          continue;
        }
        const decoration = {
          range: new monaco.Range(parsedLineNum, 1, parsedLineNum, 1),
          options: {
            isWholeLine: true,
            inlineClassName: `line-decoration-${colour}`,
          },
        };
        newDecorations.push(decoration);
      }
      decorationsRef.current?.set(newDecorations);
    }
  }, [lineNumDetails]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Base (light theme) backgrounds — keep original hues for node→code consistency */
      .line-decoration-d9f0e9 { background: #d9f0e9; }
      .line-decoration-ffffe3 { background: #ffffe3; }
      .line-decoration-e9e8f1 { background: #e9e8f1; }
      .line-decoration-ffd6d2 { background: #ffd6d2; }
      .line-decoration-d4e5ee { background: #d4e5ee; }
      .line-decoration-d5e4ef { background: #d5e4ef; }
      .line-decoration-ffe5c9 { background: #ffe5c9; }
      .line-decoration-e5f4cd { background: #e5f4cd; }
      .line-decoration-f2f2f0 { background: #f2f2f0; }
      .line-decoration-e9d6e7 { background: #e9d6e7; }
      .line-decoration-edf8ea { background: #edf8ea; }
      .line-decoration-fff8cf { background: #fff8cf; }

      .line-decoration-text-d9f0e9 { background: #d9f0e9; }
      .line-decoration-text-ffffe3 { background: #ffffe3; }
      .line-decoration-text-e9e8f1 { background: #e9e8f1; }
      .line-decoration-text-ffd6d2 { background: #ffd6d2; }
      .line-decoration-text-d4e5ee { background: #d4e5ee; }
      .line-decoration-text-d5e4ef { background: #d5e4ef; }
      .line-decoration-text-ffe5c9 { background: #ffe5c9; }
      .line-decoration-text-e5f4cd { background: #e5f4cd; }
      .line-decoration-text-f2f2f0 { background: #f2f2f0; }
      .line-decoration-text-e9d6e7 { background: #e9d6e7; }
      .line-decoration-text-edf8ea { background: #edf8ea; }
      .line-decoration-text-fff8cf { background: #fff8cf; }

      /* Dark theme: keep hue mapping, but reduce fill opacity and add outline for readability */
      [data-theme='dark'] .line-decoration-d9f0e9 { background: rgba(217, 240, 233, 0.27); }
      [data-theme='dark'] .line-decoration-ffffe3 { background: rgba(255, 255, 227, 0.27); }
      [data-theme='dark'] .line-decoration-e9e8f1 { background: rgba(233, 232, 241, 0.27); }
      [data-theme='dark'] .line-decoration-ffd6d2 { background: rgba(255, 214, 210, 0.27); }
      [data-theme='dark'] .line-decoration-d4e5ee { background: rgba(212, 229, 238, 0.27); }
      [data-theme='dark'] .line-decoration-d5e4ef { background: rgba(213, 228, 239, 0.27); }
      [data-theme='dark'] .line-decoration-ffe5c9 { background: rgba(255, 229, 201, 0.27); }
      [data-theme='dark'] .line-decoration-e5f4cd { background: rgba(229, 244, 205, 0.27); }
      [data-theme='dark'] .line-decoration-f2f2f0 { background: rgba(242, 242, 240, 0.27); }
      [data-theme='dark'] .line-decoration-e9d6e7 { background: rgba(233, 214, 231, 0.27); }
      [data-theme='dark'] .line-decoration-edf8ea { background: rgba(237, 248, 234, 0.27); }
      [data-theme='dark'] .line-decoration-fff8cf { background: rgba(255, 248, 207, 0.27); }

      [data-theme='dark'] .line-decoration-text-d9f0e9,
      [data-theme='dark'] .line-decoration-text-ffffe3,
      [data-theme='dark'] .line-decoration-text-e9e8f1,
      [data-theme='dark'] .line-decoration-text-ffd6d2,
      [data-theme='dark'] .line-decoration-text-d4e5ee,
      [data-theme='dark'] .line-decoration-text-d5e4ef,
      [data-theme='dark'] .line-decoration-text-ffe5c9,
      [data-theme='dark'] .line-decoration-text-e5f4cd,
      [data-theme='dark'] .line-decoration-text-f2f2f0,
      [data-theme='dark'] .line-decoration-text-e9d6e7,
      [data-theme='dark'] .line-decoration-text-edf8ea,
      [data-theme='dark'] .line-decoration-text-fff8cf,
      [data-theme='dark'] .line-decoration-d9f0e9,
      [data-theme='dark'] .line-decoration-ffffe3,
      [data-theme='dark'] .line-decoration-e9e8f1,
      [data-theme='dark'] .line-decoration-ffd6d2,
      [data-theme='dark'] .line-decoration-d4e5ee,
      [data-theme='dark'] .line-decoration-d5e4ef,
      [data-theme='dark'] .line-decoration-ffe5c9,
      [data-theme='dark'] .line-decoration-e5f4cd,
      [data-theme='dark'] .line-decoration-f2f2f0,
      [data-theme='dark'] .line-decoration-e9d6e7,
      [data-theme='dark'] .line-decoration-edf8ea,
      [data-theme='dark'] .line-decoration-fff8cf {
        /* Improve legibility of Monaco dark tokens on light highlight without changing token colors */
        text-shadow: 0 0 2px rgba(0,0,0,0.9), 0 0 1px rgba(0,0,0,0.9);
      }
    `;
    document.head.appendChild(style);
  }, []);

  const [theme, setTheme] = useState<string>('websvf-light'); // Monaco theme name

  // Create a Monaco theme that follows CSS variables
  const normalizeHex = (value: string, fallback: string) => {
    const raw = (value && value.trim()) || fallback;
    const v = raw.toLowerCase();
    const m3 = /^#([0-9a-f]{3})$/i.exec(v);
    if (m3) {
      const [r, g, b] = m3[1].split('');
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    return v;
  };

  const applyMonacoThemeFromCSSVars = React.useCallback(
    (mode: 'light' | 'dark') => {
      if (!monacoInstance) return;
      const root = getComputedStyle(document.documentElement);
      const backgroundRaw = root.getPropertyValue('--surface') || '#ffffff';
      const foregroundRaw = root.getPropertyValue('--text-color') || '#0f172a';
      const background = normalizeHex(backgroundRaw, '#ffffff');
      const foreground = normalizeHex(foregroundRaw, '#0f172a');
      const themeName = mode === 'dark' ? 'websvf-dark' : 'websvf-light';
      monacoInstance.editor.defineTheme(themeName, {
        base: mode === 'dark' ? 'vs-dark' : 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': background,
          'editor.foreground': foreground,
          'editorCursor.foreground': foreground,
          'editorLineNumber.foreground': foreground,
          'editorLineNumber.activeForeground': foreground,
          'editorGutter.background': background,
          'editor.selectionBackground': mode === 'dark' ? '#114a6c80' : '#60a5fa55',
          'editor.inactiveSelectionBackground': mode === 'dark' ? '#114a6c55' : '#93c5fd55',
          'editor.lineHighlightBackground': mode === 'dark' ? '#0e223a66' : '#e5e7eb',
          'minimap.background': background,
        },
      });
      // Ensure the theme is applied immediately (not just via prop)
      monacoInstance.editor.setTheme(themeName);
      setTheme(themeName);
    },
    [monacoInstance]
  );

  // Effect to handle dynamic theme changes based on the `data-theme` attribute
  useEffect(() => {
    const updateTheme = () => {
      const mode =
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyMonacoThemeFromCSSVars(mode);
    };

    // Initial theme setting based on the attribute
    updateTheme();

    // Listen for changes to the data-theme attribute
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect(); // Cleanup observer on unmount
  }, [monacoInstance, applyMonacoThemeFromCSSVars]);

  // Compute the effective font size: local control wins once user interacts
  const effectiveFontSize = useLocalFontSize ? fontSize : externalFontSize ?? fontSize;

  // Ensure font size updates are applied to Monaco immediately
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: effectiveFontSize });
    }
  }, [effectiveFontSize]);

  return (
    <>
      <div>
        <div
          id="codeEditor-fontSize-container"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <FontSizeMenu
            fontSize={effectiveFontSize}
            setFontSize={(size: number) => {
              // Update local immediately for responsiveness
              setUseLocalFontSize(true);
              setFontSize(size);
              // Also update the external settings so the Settings modal reflects the change
              if (onExternalFontSizeChange) onExternalFontSizeChange(size);
            }}
          />
          <LanguageSelector lang={lang} setLang={setLang} />
          <button
            type="button"
            title="Reset editor to default code"
            className="default-code-button"
            onClick={openDefaultModal}
            style={{
              height: 32,
              padding: '0 10px',
              borderRadius: 8,
              border: '1px solid var(--border-color)',
              background: 'transparent',
              color: 'var(--text-color)',
              cursor: 'pointer',
            }}
          >
            Reset to Default Code
          </button>
        </div>
        <DefaultCodeModal
          open={showDefaultModal}
          handleClose={closeDefaultModal}
          setCode={(newCode: string) => {
            setCode(newCode);
            if (editorRef.current) {
              const model = editorRef.current.getModel();
              if (model) model.setValue(newCode);
            }
          }}
          language={lang}
        />
        <Editor
          key={editorKey}
          height="90vh"
          language={lang}
          theme={theme}
          value={code}
          onMount={handleEditorDidMount}
          options={{ fontSize: effectiveFontSize }}
        />
      </div>
    </>
  );
};

export default CodeEditor;
