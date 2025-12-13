import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { Terminal, Trash2 } from 'lucide-react';

export default function Console({ socket }) {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (!terminalRef.current) {
      console.log('[Console] terminalRef not ready');
      return;
    }
    
    // Don't re-init if we already have a working terminal
    if (xtermRef.current && !xtermRef.current._core?._isDisposed) {
      console.log('[Console] Terminal already active, skipping init');
      return;
    }

    console.log('[Console] Starting initialization...');

    let xterm = null;
    let fitAddon = null;
    let initTimeout = null;

    const initTerminal = () => {
      try {
        console.log('[Console] Creating XTerm instance...');
        
        // Initialize xterm
        xterm = new XTerm({
          theme: {
            background: '#1f2937',
            foreground: '#f3f4f6',
            cursor: '#60a5fa',
            selection: '#3b82f6',
            black: '#000000',
            red: '#ef4444',
            green: '#10b981',
            yellow: '#f59e0b',
            blue: '#3b82f6',
            magenta: '#8b5cf6',
            cyan: '#06b6d4',
            white: '#f3f4f6',
            brightBlack: '#6b7280',
            brightRed: '#f87171',
            brightGreen: '#34d399',
            brightYellow: '#fbbf24',
            brightBlue: '#60a5fa',
            brightMagenta: '#a78bfa',
            brightCyan: '#22d3ee',
            brightWhite: '#ffffff',
          },
          fontSize: 14,
          fontFamily: 'Monaco, Menlo, "Courier New", monospace',
          cursorBlink: true,
          cursorStyle: 'block',
          convertEol: true,
          scrollback: 1000,
          rows: 24,
          cols: 80,
        });

        console.log('[Console] XTerm instance created');

        // Create fit addon
        fitAddon = new FitAddon();
        xterm.loadAddon(fitAddon);
        console.log('[Console] FitAddon loaded');
        
        // Open terminal in the DOM
        console.log('[Console] Opening terminal in DOM...');
        xterm.open(terminalRef.current);
        console.log('[Console] Terminal opened in DOM');
        
        // Store refs immediately
        xtermRef.current = xterm;
        fitAddonRef.current = fitAddon;

        // Write welcome message immediately (before fit)
        console.log('[Console] Writing welcome message...');
        xterm.writeln('\x1b[36m╔════════════════════════════════════════╗\x1b[0m');
        xterm.writeln('\x1b[36m║         WebTest Console v1.0           ║\x1b[0m');
        xterm.writeln('\x1b[36m╚════════════════════════════════════════╝\x1b[0m');
        xterm.writeln('');
        xterm.writeln('\x1b[32m✓ Terminal initialized\x1b[0m');
        xterm.writeln('\x1b[33m⏳ Fitting dimensions...\x1b[0m');
        xterm.writeln('');
        console.log('[Console] Welcome message written');

        // Try to fit after a delay
        initTimeout = setTimeout(() => {
          if (!isMountedRef.current) {
            console.log('[Console] Component unmounted, skipping fit');
            return;
          }
          
          try {
            console.log('[Console] Attempting to fit...');
            fitAddon.fit();
            console.log('[Console] ✓ Fit successful');
            xterm.writeln('\x1b[32m✓ Terminal ready!\x1b[0m');
            xterm.writeln('');
          } catch (e) {
            console.warn('[Console] Fit failed (non-fatal):', e);
            xterm.writeln('\x1b[33m⚠ Fit skipped (non-fatal)\x1b[0m');
            xterm.writeln('');
          }
          
          if (isMountedRef.current) {
            setIsReady(true);
          }
        }, 500);

      } catch (error) {
        console.error('[Console] FATAL: Failed to initialize terminal:', error);
      }
    };

    // Small delay before init
    const timer = setTimeout(initTerminal, 100);

    return () => {
      console.log('[Console] Cleanup triggered');
      isMountedRef.current = false;
      clearTimeout(timer);
      clearTimeout(initTimeout);
      // Don't dispose the terminal - let it persist
      // Only dispose on final component unmount (handled separately)
    };
  }, []);

  // Separate effect for terminal ready state
  useEffect(() => {
    if (xtermRef.current && !xtermRef.current._core?._isDisposed) {
      setIsReady(true);
    }
  }, [xtermRef.current]);

  useEffect(() => {
    if (!socket) {
      console.log('[Console] No socket connection');
      return;
    }
    
    if (!isReady) {
      console.log('[Console] Terminal not ready for socket events');
      return;
    }
    
    if (!xtermRef.current) {
      console.log('[Console] No terminal ref for socket events');
      return;
    }

    console.log('[Console] Attaching socket event listeners...');

    const handleOutput = (data) => {
      const xterm = xtermRef.current;
      if (!xterm) return;

      console.log('[Console] Output received:', data);
      
      // Extract text
      let text = '';
      if (typeof data === 'string') {
        text = data;
      } else if (data && data.data) {
        text = data.data;
      } else {
        console.warn('[Console] Unknown data format:', data);
        return;
      }

      if (typeof text !== 'string') {
        console.warn('[Console] Text is not a string:', text);
        return;
      }

      try {
        // Color code
        if (data.type === 'stderr') {
          xterm.write('\x1b[31m');
        } else if (text.includes('✓') || text.includes('passed')) {
          xterm.write('\x1b[32m');
        } else if (text.includes('✘') || text.includes('failed')) {
          xterm.write('\x1b[31m');
        } else if (text.includes('Running')) {
          xterm.write('\x1b[36m\x1b[1m');
        } else if (text.includes('-')) {
          xterm.write('\x1b[33m');
        }

        xterm.write(text);
        xterm.write('\x1b[0m');
      } catch (error) {
        console.error('[Console] Write error:', error);
      }
    };

    const handleTestStarted = (data) => {
      const xterm = xtermRef.current;
      if (!xterm) return;
      console.log('[Console] Test started:', data);
      try {
        xterm.writeln('\r\n\x1b[36m\x1b[1m╔════════════════════════════════════════╗\x1b[0m');
        xterm.writeln('\x1b[36m\x1b[1m║         TEST STARTED                   ║\x1b[0m');
        xterm.writeln('\x1b[36m\x1b[1m╚════════════════════════════════════════╝\x1b[0m');
        xterm.writeln('Tests: \x1b[33m' + JSON.stringify(data.testIds) + '\x1b[0m');
        xterm.writeln('');
      } catch (e) {
        console.error('[Console] handleTestStarted error:', e);
      }
    };

    const handleTestCompleted = (data) => {
      const xterm = xtermRef.current;
      if (!xterm) return;
      console.log('[Console] Test completed:', data);
      try {
        xterm.writeln('\r\n\x1b[36m\x1b[1m╔════════════════════════════════════════╗\x1b[0m');
        xterm.writeln('\x1b[36m\x1b[1m║       TEST COMPLETED                   ║\x1b[0m');
        xterm.writeln('\x1b[36m\x1b[1m╚════════════════════════════════════════╝\x1b[0m');
        if (data.results) {
          xterm.writeln('');
          xterm.writeln('✓ Passed:  \x1b[32m\x1b[1m' + data.results.passed + '\x1b[0m');
          xterm.writeln('✗ Failed:  \x1b[31m\x1b[1m' + data.results.failed + '\x1b[0m');
          xterm.writeln('⊘ Skipped: \x1b[33m\x1b[1m' + data.results.skipped + '\x1b[0m');
        }
        xterm.writeln('');
      } catch (e) {
        console.error('[Console] handleTestCompleted error:', e);
      }
    };

    socket.on('test:output', handleOutput);
    socket.on('test:started', handleTestStarted);
    socket.on('test:completed', handleTestCompleted);

    console.log('[Console] Socket listeners attached');

    return () => {
      console.log('[Console] Removing socket listeners');
      socket.off('test:output', handleOutput);
      socket.off('test:started', handleTestStarted);
      socket.off('test:completed', handleTestCompleted);
    };
  }, [socket, isReady]);

  const clearConsole = () => {
    console.log('[Console] Clear button clicked');
    const xterm = xtermRef.current;
    if (!xterm) {
      console.warn('[Console] No terminal to clear');
      return;
    }
    
    try {
      xterm.clear();
      xterm.writeln('\x1b[36m╔════════════════════════════════════════╗\x1b[0m');
      xterm.writeln('\x1b[36m║         WebTest Console v1.0           ║\x1b[0m');
      xterm.writeln('\x1b[36m╚════════════════════════════════════════╝\x1b[0m');
      xterm.writeln('');
      xterm.writeln('\x1b[33m⚠ Console cleared\x1b[0m');
      xterm.writeln('');
      console.log('[Console] Console cleared successfully');
    } catch (e) {
      console.error('[Console] Clear error:', e);
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-semibold">Console</h2>
          {isReady && <span className="text-xs text-green-400">● Ready</span>}
          {!isReady && <span className="text-xs text-yellow-400">● Initializing...</span>}
        </div>
        <button
          onClick={clearConsole}
          className="btn-secondary flex items-center gap-2 text-sm"
          disabled={!isReady}
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>
      <div
        ref={terminalRef}
        className="flex-1 bg-gray-800 rounded-lg p-2 overflow-hidden"
        style={{ minHeight: '300px', maxHeight: '500px' }}
      />
    </div>
  );
}
