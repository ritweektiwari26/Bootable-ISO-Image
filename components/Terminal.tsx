
import React, { useEffect, useRef } from 'react';
import { BuildLog } from '../types';

interface TerminalProps {
  logs: BuildLog[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 h-64 overflow-y-auto mono text-sm">
      {logs.map((log, idx) => (
        <div key={idx} className="mb-1">
          <span className="text-zinc-500">[{log.timestamp}]</span>{' '}
          <span className={
            log.type === 'error' ? 'text-red-400' :
            log.type === 'success' ? 'text-emerald-400' :
            log.type === 'warning' ? 'text-amber-400' :
            'text-zinc-300'
          }>
            {log.type === 'error' ? '✖ ' : log.type === 'success' ? '✔ ' : 'i '}
            {log.message}
          </span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default Terminal;
