import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount, useMonaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import FontSizeMenu from '../../fontSizeMenu/FontSizeMenu';
import './terminalOutput.css';
interface TerminalOutputProps {
  terminalOutputString: string;
  externalFontSize?: number;
  onExternalFontSizeChange?: (size: number) => void;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({
  terminalOutputString,
  externalFontSize,
  onExternalFontSizeChange,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [useLocalFontSize, setUseLocalFontSize] = useState(false);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.updateOptions({
      readOnly: true,
      fontSize: useLocalFontSize ? fontSize : externalFontSize ?? fontSize,
    });

    editor.onDidChangeModelContent(() => {
      editor.getValue();
    });
  };

  const [theme, setTheme] = useState('websvf-light');
  const monacoInstance = useMonaco();

  // Apply effective font size immediately when changed
  const effectiveFontSize = useLocalFontSize ? fontSize : externalFontSize ?? fontSize;

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

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: effectiveFontSize });
    }
  }, [effectiveFontSize]);

  // Create and apply Monaco theme using CSS variables
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
      monacoInstance.editor.setTheme(themeName);
      setTheme(themeName);
    },
    [monacoInstance]
  );

  // Detect theme change based on the "data-theme" attribute
  useEffect(() => {
    const updateTheme = () => {
      const mode =
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyMonacoThemeFromCSSVars(mode);
    };

    // Initial theme setting
    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, [monacoInstance, applyMonacoThemeFromCSSVars]);

  return (
    <>
      <div>
        <div id="terminalOutput-fontSize-container">
          <FontSizeMenu
            fontSize={effectiveFontSize}
            setFontSize={(size: number) => {
              setUseLocalFontSize(true);
              setFontSize(size);
              if (onExternalFontSizeChange) onExternalFontSizeChange(size);
            }}
          />
        </div>
        <Editor
          height="90vh"
          language="plaintext"
          theme={theme}
          value={terminalOutputString}
          onMount={handleEditorDidMount}
          options={{ fontSize: effectiveFontSize }}
        />
      </div>
    </>
  );
};

export default TerminalOutput;
