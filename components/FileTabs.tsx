
import React, { useState } from 'react';
import { GeneratedFile } from '../types';

interface FileTabsProps {
  files: GeneratedFile[];
}

const FileTabs: React.FC<FileTabsProps> = ({ files }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!files.length) return null;

  return (
    <div className="flex flex-col h-full border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900">
      <div className="flex bg-zinc-950 border-b border-zinc-800 overflow-x-auto scrollbar-hide">
        {files.map((file, idx) => (
          <button
            key={file.name}
            onClick={() => setActiveIdx(idx)}
            className={`px-4 py-2 text-sm whitespace-nowrap border-r border-zinc-800 transition-colors ${
              activeIdx === idx ? 'bg-zinc-900 text-indigo-400' : 'text-zinc-500 hover:bg-zinc-900'
            }`}
          >
            {file.name}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <pre className="mono text-sm text-zinc-300 whitespace-pre-wrap">
          <code>{files[activeIdx]?.content}</code>
        </pre>
      </div>
    </div>
  );
};

export default FileTabs;
