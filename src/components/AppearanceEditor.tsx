import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, AlertCircle, FileJson } from 'lucide-react';
import { cn } from '../lib/utils';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css'; // Use a dark theme base

import { notifyAppearanceUpdate } from '../lib/appearance';

const DEFAULT_CONFIG = {
  theme: 'dark',
  colors: {
    primary: '#7dd3fc',
    secondary: '#fde047',
    tertiary: '#86efac',
    background: 'transparent',
    text: '#0f172a',
    border: '#0ea5e9'
  },
  mermaid: {
    primaryColor: '#7dd3fc',
    primaryTextColor: '#082f49',
    primaryBorderColor: '#38bdf8',
    lineColor: '#94a3b8',
    secondaryColor: '#fde047',
    tertiaryColor: '#86efac',
    mainBkg: 'transparent',
    nodeBorder: '#0ea5e9',
    clusterBkg: 'rgba(30, 41, 59, 0.5)',
    clusterBorder: '#475569',
    titleColor: '#e2e8f0',
    edgeLabelBackground: '#0f172a',
    nodeTextColor: '#0f172a',
    labelTextColor: '#f1f5f9'
  },
  charts: {
    pie: ['#7dd3fc', '#fde047', '#86efac', '#fda4af', '#d8b4fe'],
    font: '"Inter", sans-serif'
  },
  callouts: {
    note: { background: '#f0f7fb', text: '#000000', border: '#447099' },
    tip: { background: '#eefaef', text: '#000000', border: '#027a38' },
    warning: { background: '#fff9ed', text: '#000000', border: '#d9971c' },
    caution: { background: '#fff5f0', text: '#000000', border: '#cc5500' },
    important: { background: '#fcecec', text: '#000000', border: '#cc0000' }
  },
  tags: [
    '#7dd3fc',
    '#fde047',
    '#86efac',
    '#fda4af',
    '#d8b4fe',
    '#fbbf24',
    '#f472b6',
    '#a78bfa'
  ]
};

export const AppearanceEditor: React.FC = () => {
  const [config, setConfig] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const timeoutRef = React.useRef<any>(null);
  const path = localStorage.getItem('appearanceConfigPath') || '~/config/plots.json';

  useEffect(() => {
    const savedConfig = localStorage.getItem('appearance_json_data');
    if (savedConfig) {
      setConfig(savedConfig);
    } else {
      setConfig(JSON.stringify(DEFAULT_CONFIG, null, 2));
    }
  }, []);

  const handleSave = () => {
    try {
      JSON.parse(config); // Validate JSON
      localStorage.setItem('appearance_json_data', config);
      setError(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError('Invalid JSON format');
    }
  };

  const resetToDefault = () => {
    setConfig(JSON.stringify(DEFAULT_CONFIG, null, 2));
    setError(null);
  };

  const highlightWithColors = (code: string) => {
    let highlighted = Prism.highlight(code, Prism.languages.json, 'json');
    
    // Regex for colors in the highlighted HTML
    highlighted = highlighted.replace(
      /(#([A-Fa-f0-9]{3,6}))|((?:rgba?)\([^)]+\))|(transparent)/g,
      (match) => {
        const isTransparent = match === 'transparent';
        // We use a relative span for the text and an absolute dot in the "gutter" (padding area)
        // to avoid shifting the text horizontally, which breaks cursor alignment.
        return `<span class="relative" style="color: ${isTransparent ? '#7a7a7a' : match}"><span class="absolute right-full mr-4 w-3 h-3 rounded-full border border-white/20 overflow-hidden" style="top: 50%; transform: translateY(-50%); background-image: repeating-conic-gradient(#333 0% 25%, #111 0% 50%); background-size: 4px 4px;"><span class="absolute inset-0" style="background-color: ${match}"></span></span>${match}</span>`;
      }
    );

    return highlighted;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] text-white">
      <header className="px-8 h-16 border-b border-white/[0.05] flex items-center justify-between shrink-0 bg-[#0f0f0f]">
        <div className="flex items-center gap-3">
          <FileJson size={18} className="text-white" />
          <div className="flex flex-col">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest leading-none mb-1">Appearance Config</span>
            <span className="text-sm font-medium text-white/80">{path}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={resetToDefault}
            className="px-3 py-1.5 text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest flex items-center gap-2"
          >
            <RefreshCw size={12} />
            Reset Defaults
          </button>
          <button 
            onClick={handleSave}
            className={cn(
              "px-6 h-9 rounded-lg font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 active:scale-95 shadow-lg",
              saved ? "bg-white text-black" : "bg-white/10 hover:bg-white/20 text-white"
            )}
          >
             {saved ? 'Success' : (
               <>
                 <Save size={14} />
                 Save Config
               </>
             )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 p-3 bg-red-500/90 backdrop-blur-md border border-red-500/20 rounded-xl flex items-center gap-3 text-white text-xs shadow-2xl">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
        
        <div className="flex-1 overflow-auto bg-[#0a0a0a] scrollbar-thin">
          <Editor
            value={config}
            onValueChange={code => {
              setConfig(code);
              try {
                JSON.parse(code); // Validate JSON before saving to localStorage
                localStorage.setItem('appearance_json_data', code);
              } catch (e) {
                // Silently fail for partial JSON while typing
              }
              // Debounce notification slightly to prevent lag during rapid typing
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              timeoutRef.current = setTimeout(() => notifyAppearanceUpdate(), 100);
            }}
            highlight={code => highlightWithColors(code)}
            padding={40}
            className="font-mono text-sm leading-6 min-h-full"
            textareaClassName="outline-none focus:ring-0 !font-mono !text-sm !leading-6"
            preClassName="!font-mono !text-sm !leading-6"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              lineHeight: '24px'
            }}
          />
        </div>
      </div>
    </div>
  );
};
