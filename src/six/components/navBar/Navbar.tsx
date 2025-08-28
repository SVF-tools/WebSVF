import React, { useState, useEffect, useRef } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import './navbar.css';
import { ImportExport, Publish } from '@mui/icons-material';
import readFile from '../importExport/importExport';

function Navbar({
  openShare,
  setCode,
  code,
  openSettings,
}: {
  openShare: () => void;
  setCode: (code: string) => void;
  code: string;
  openSettings: () => void;
}) {
  const [theme, setTheme] = useState('light');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const userConfirmed = window.confirm(
      `Are you sure you want to import "${file.name}"? This will replace the current code.`
    );

    if (!userConfirmed) {
      event.target.value = '';
      return;
    }

    try {
      const contents = await readFile(file);
      setCode(contents);
    } catch (error) {
      console.error('Failed to import file:', error);
    } finally {
      event.target.value = '';
    }
  };

  const handleExportClick = async () => {
    if ('showSaveFilePicker' in window) {
      try {
        const opts = {
          types: [
            {
              description: 'C Source Files',
              accept: { 'text/plain': ['.c'] },
            },
          ],
        };

        type FileWriter = { write: (data: string) => Promise<void>; close: () => Promise<void> };
        type FileHandle = { createWritable: () => Promise<FileWriter> };
        type SaveFilePicker = {
          showSaveFilePicker: (o: {
            types: Array<{ description: string; accept: Record<string, string[]> }>;
          }) => Promise<FileHandle>;
        };

        const handle = await (window as unknown as SaveFilePicker).showSaveFilePicker(opts);
        const writable = await handle.createWritable();
        await writable.write(code);
        await writable.close();
        return;
      } catch (err) {
        console.error('File save canceled or failed', err);
      }
      return;
    }

    // Fallback for unsupported browsers
    const defaultFilename = 'exported_code.c';
    const fileName = window.prompt('Enter filename to save as:', defaultFilename);
    if (!fileName) return;

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.c') ? fileName : `${fileName}.c`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div id="navbar" className="shadow-md">
      <a
        id="webSVF-home-link"
        href="https://github.com/SVF-tools/CapStoneWebSVF6.0"
        target="_blank"
        rel="noopener noreferrer"
        title="CapStoneWebSVF6.0 Repository"
        aria-label="CapStoneWebSVF6.0 Repository"
      >
        <img src="/svfLogo.png" alt="SVF logo" id="svf-logo" />
      </a>
      <div className="nav-actions">
        <div className="icon-container">
          <Publish id="import-export-icon" onClick={handleExportClick} />
          <span className="tooltip">Export Code</span>
        </div>

        <div className="icon-container">
          <ImportExport id="import-export-icon" onClick={handleImportClick} />
          <span className="tooltip">Import Code</span>
        </div>

        <div className="icon-container">
          <ShareIcon onClick={openShare} id="share-icon" />
          <span className="tooltip">Share</span>
        </div>

        <div className="icon-container">
          <SettingsIcon id="settings-icon" onClick={openSettings} />
          <span className="tooltip">Settings</span>
        </div>

        <div className="icon-container">
          <a
            href="https://svf-tools.github.io/WebSVF/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="About WebSVF"
            title="About WebSVF"
            style={{ color: 'var(--icon-color)' }}
          >
            <InfoOutlinedIcon />
          </a>
          <span className="tooltip">About</span>
        </div>

        <label className="theme-toggle">
          <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
          <span className="theme-slider"></span>
        </label>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".c"
        />
      </div>
    </div>
  );
}

export default Navbar;
