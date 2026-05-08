import React, { useEffect, useState } from 'react';
import { Minus, Square, X } from 'lucide-react';

export const TitleBar: React.FC = () => {
    const [isElectron, setIsElectron] = useState(false);

    useEffect(() => {
        setIsElectron(navigator.userAgent.toLowerCase().includes('electron'));
    }, []);

    if (!isElectron) return null;

    const handleMinimize = () => {
        if (window.require) {
            const ipcRenderer = window.require('electron').ipcRenderer;
            ipcRenderer.send('window-min');
        }
    };

    const handleMaximize = () => {
        if (window.require) {
            const ipcRenderer = window.require('electron').ipcRenderer;
            ipcRenderer.send('window-max');
        }
    };

    const handleClose = () => {
        if (window.require) {
            const ipcRenderer = window.require('electron').ipcRenderer;
            ipcRenderer.send('window-close');
        }
    };

    return (
        <div className="h-10 w-full bg-[#0a0a0a] flex items-center justify-between shrink-0 select-none border-b border-white/5" style={{ WebkitAppRegion: 'drag' } as any}>
            <div className="flex items-center px-4 gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-5 h-5 rounded opacity-80">
                    <rect width="256" height="256" fill="#111" rx="48"/>
                    <text x="128" y="152" fontFamily="Inter, sans-serif" fontSize="88" fontWeight="800" fill="#ffffff" textAnchor="middle" letterSpacing="-4">MD</text>
                </svg>
                <span className="text-white/60 text-[11px] font-bold tracking-[0.2em] uppercase">MinD.md</span>
            </div>
            
            <div className="flex h-full" style={{ WebkitAppRegion: 'no-drag' } as any}>
                <button 
                    onClick={handleMinimize}
                    className="h-full w-12 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <Minus size={14} />
                </button>
                <button 
                    onClick={handleMaximize}
                    className="h-full w-12 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <Square size={12} />
                </button>
                <button 
                    onClick={handleClose}
                    className="h-full w-12 flex items-center justify-center text-white/40 hover:text-white hover:bg-red-500 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};
