import React, { useEffect, useRef, useState } from 'react';
import { Terminal, type IDisposable } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import styles from './realTerminal.module.css';

interface RealTerminalProps {
  codeToPaste?: string; // optional code payload from the editor
  sessionId?: string;   // optional logical session id to enforce one terminal per session
}

const RealTerminal: React.FC<RealTerminalProps> = ({ codeToPaste, sessionId }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal>();
  const fitAddon = useRef<FitAddon>();
  const socketRef = useRef<WebSocket | null>(null);
  const initializedRef = useRef<boolean>(false);
  const connectRef = useRef<() => void>();
  const [status, setStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  // Track a single active onData subscription and connection session
  const dataDisposableRef = useRef<IDisposable | null>(null);
  const sessionRef = useRef<number>(0);
  const connectingRef = useRef<boolean>(false);
  // Track latest sessionId so reconnects use the current one
  const sidRef = useRef<string | undefined>(sessionId);

  useEffect(() => {
    if (initializedRef.current) {
      // Avoid double-mount in React 18 StrictMode
      return;
    }
    initializedRef.current = true;

    // Initialize terminal
    term.current = new Terminal({
      fontSize: 14,
      cursorBlink: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
      },
      // 👇 Add these to fix echo and formatting
      allowProposedApi: true,
      convertEol: true,
      scrollback: 1000,
      disableStdin: false, // optional; leave this if you want to type
    });

    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);

    // Open terminal in DOM element (guard if container not yet ready)
    if (terminalRef.current) {
      term.current.open(terminalRef.current);
    }

    // Fit terminal to container after a short delay to ensure DOM is ready
    setTimeout(() => {
      if (fitAddon.current && term.current) {
        fitAddon.current.fit();
      }
    }, 100);

    // Connect to WebSocket server
    const connectWebSocket = () => {
      if (connectingRef.current) return; // prevent parallel connects
      setStatus('connecting');
      connectingRef.current = true;
      const connId = sessionRef.current + 1; // next connection id
      sessionRef.current = connId;

      // Dispose previous input handler so keys don't go to old sockets
      if (dataDisposableRef.current) {
        try {
          const d = dataDisposableRef.current as IDisposable | null;
          d?.dispose();
        } catch { /* ignore */ }
        dataDisposableRef.current = null;
      }

      const isDev = process.env.NODE_ENV !== 'production';
      const base = isDev
        ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/terminal`
        : 'wss://api-broken-moon-5814.fly.dev/ws/terminal';
      const sid = sidRef.current;
      const url = sid ? `${base}?sid=${encodeURIComponent(sid)}` : base;
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        if (connId !== sessionRef.current) return; // stale connection
        console.log('WebSocket connected');
        setStatus('online');
        connectingRef.current = false;
        // Send initial size so PTY matches
        try {
          if (term.current) {
            const cols = term.current.cols;
            const rows = term.current.rows;
            ws.send(JSON.stringify({ type: 'resize', cols, rows }));
          }
        } catch { /* ignore */ }
        // Don't write anything else here, let the server send the initial prompt
      };

      ws.onmessage = (event) => {
        if (connId !== sessionRef.current) return; // ignore messages from stale sockets
        if (term.current) {
          term.current.write(event.data);
        }
      };

      ws.onerror = (error) => {
        if (connId !== sessionRef.current) return;
        console.error('WebSocket error:', error);
        try {
          term.current?.writeln('\r\n[WebSocket error occurred]');
        } catch {
          // ignore if terminal not ready
        }
      };

      ws.onclose = (event) => {
        if (connId !== sessionRef.current) return; // only current session manages lifecycle
        console.log('WebSocket closed:', event.code, event.reason);
        setStatus('offline');
        connectingRef.current = false;
        try {
          term.current?.writeln('\r\n[Disconnected from terminal]');
        } catch {
          // ignore if terminal not ready
        }

        // Attempt to reconnect after 3 seconds if it wasn't a normal closure
        // Skip auto-reconnect for 1013 (session busy) to avoid loops
        if (event.code !== 1000 && event.code !== 1013) {
          setTimeout(() => {
            if (term.current && initializedRef.current && connId === sessionRef.current) {
              term.current.writeln('[Attempting to reconnect...]');
              connectWebSocket();
            }
          }, 3000);
        }
      };

      // Handle terminal input (ensure single handler bound to the active socket)
      if (term.current) {
        try {
          const d = dataDisposableRef.current as IDisposable | null;
          d?.dispose();
        } catch { /* ignore */ }
        dataDisposableRef.current = term.current.onData((data) => {
          if (connId === sessionRef.current && ws.readyState === WebSocket.OPEN) {
            ws.send(data);
          }
        });
      }
    };

    connectRef.current = connectWebSocket;
    connectWebSocket();

    // Handle window resize
    const handleResize = () => {
      if (fitAddon.current && term.current) {
        fitAddon.current.fit();
        try {
          const ws = socketRef.current;
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({ type: 'resize', cols: term.current.cols, rows: term.current.rows })
            );
          }
        } catch { /* ignore */ }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      // Invalidate current session so any late events are ignored
      sessionRef.current += 1;
      connectingRef.current = false;

      if (socketRef.current) {
        try { socketRef.current.close(1000, 'Component unmounting'); } catch { /* ignore */ }
      }

      try {
        const d = dataDisposableRef.current as IDisposable | null;
        d?.dispose();
      } catch { /* ignore */ }
      dataDisposableRef.current = null;

      if (term.current) {
        term.current.dispose();
      }

      initializedRef.current = false;
    };
  }, []);

  const onClear = () => {
    try { term.current?.clear(); } catch { /* ignore */ }
  };
  const onReconnect = () => {
    try { socketRef.current?.close(1000, 'Manual reconnect'); } catch { /* ignore */ }
    connectRef.current && connectRef.current();
  };

  // Paste-only: send bracketed paste so shell won't auto-execute
  const onPasteCode = () => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (!codeToPaste) return;
    const payload = `\u001b[200~${codeToPaste}\u001b[201~`;
    try { ws.send(payload); } catch { /* ignore */ }
  };

  // Here-doc: write code into a file (example.c) via the terminal
  const onWriteFile = () => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (!codeToPaste) return;
    // Use a unique marker to avoid collisions with user code
    const marker = `EOF_${Math.random().toString(36).slice(2, 10)}`;
    const filename = 'example.c';
    const cmd = `cat > ${filename} <<'${marker}'\n${codeToPaste}\n${marker}\n`;
    try { ws.send(cmd); } catch { /* ignore */ }
  };

  // Reconnect when sessionId prop changes later (e.g., initial load then URL/session picked)
  const firstSidApplyRef = useRef(true);
  useEffect(() => {
    sidRef.current = sessionId || undefined;
    if (firstSidApplyRef.current) {
      firstSidApplyRef.current = false;
      return;
    }
    try { socketRef.current?.close(1000, 'Switching session'); } catch { /* ignore */ }
    connectRef.current && connectRef.current();
  }, [sessionId]);

  return (
    <div className={styles.container}>
      <div className={styles.header} id="real-terminal-header">
        <div className={styles.title}>
          <span>Terminal</span>
          <span className={styles.status}>
            <span className={`${styles.dot} ${styles[status]}`} />
            {status === 'online' ? 'Connected' : status === 'connecting' ? 'Connecting…' : 'Disconnected'}
          </span>
        </div>
        <div className={styles.actions}>
          <button className={styles.button} onClick={onClear}>Clear</button>
          <button className={styles.button} onClick={onReconnect}>Reconnect</button>
          <button id="terminal-paste-code-btn" className={styles.button} onClick={onPasteCode} disabled={!codeToPaste || status !== 'online'}>
            Paste Code
          </button>
          <button id="terminal-write-file-btn" className={styles.button} onClick={onWriteFile} disabled={!codeToPaste || status !== 'online'}>
            Write code to terminal
          </button>
        </div>
      </div>
      <div className={styles.terminalRoot}>
        <div ref={terminalRef} className={styles.terminal} />
      </div>
    </div>
  );
};

export default RealTerminal;
