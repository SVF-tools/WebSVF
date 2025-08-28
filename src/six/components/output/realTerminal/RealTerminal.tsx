import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const RealTerminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal>();
  const fitAddon = useRef<FitAddon>();
  const socketRef = useRef<WebSocket | null>(null);
  const initializedRef = useRef<boolean>(false);

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
      const ws = new WebSocket('wss://api-broken-moon-5814.fly.dev/ws/terminal');
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        // Don't write anything here, let the server send the initial prompt
      };

      ws.onmessage = (event) => {
        if (term.current) {
          term.current.write(event.data);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        try {
          term.current?.writeln('\r\n[WebSocket error occurred]');
        } catch (_e) {
          // ignore if terminal not ready
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        try {
          term.current?.writeln('\r\n[Disconnected from terminal]');
        } catch (_e) {
          // ignore if terminal not ready
        }

        // Attempt to reconnect after 3 seconds if it wasn't a normal closure
        if (event.code !== 1000) {
          setTimeout(() => {
            if (term.current && initializedRef.current) {
              term.current.writeln('[Attempting to reconnect...]');
              connectWebSocket();
            }
          }, 3000);
        }
      };

      // Handle terminal input
      if (term.current) {
        const onDataDisposable = term.current.onData((data) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
          }
        });
        // Dispose handler if we tear down early
        ws.addEventListener('close', () => {
          onDataDisposable.dispose();
        });
      }
    };

    connectWebSocket();

    // Handle window resize
    const handleResize = () => {
      if (fitAddon.current && term.current) {
        fitAddon.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      if (socketRef.current) {
        socketRef.current.close(1000, 'Component unmounting');
      }

      if (term.current) {
        term.current.dispose();
      }

      initializedRef.current = false;
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{
        height: '100%',
        width: '100%',
        minHeight: '400px', // Ensure minimum height
        padding: '8px',
        boxSizing: 'border-box',
      }}
    />
  );
};

export default RealTerminal;
