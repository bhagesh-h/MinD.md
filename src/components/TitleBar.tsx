import React, { useEffect, useState } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';

export const TitleBar: React.FC = () => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Tauri injects window.__TAURI_INTERNALS__ in the webview
        setIsDesktop(!!(window as any).__TAURI_INTERNALS__);
    }, []);

    if (!isDesktop) return null;

    const handleMinimize = () => {
        getCurrentWindow().minimize();
    };

    const handleMaximize = () => {
        getCurrentWindow().toggleMaximize();
    };

    const handleClose = () => {
        getCurrentWindow().close();
    };

    return (
        <div className="h-10 w-full bg-[#0a0a0a] flex items-center justify-between shrink-0 select-none border-b border-white/5" data-tauri-drag-region>
            <div className="flex items-center px-4 gap-2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-5 h-5 rounded opacity-80">
                    <rect width="256" height="256" fill="#111" rx="48"/>
                    <text x="128" y="152" fontFamily="Inter, sans-serif" fontSize="88" fontWeight="800" fill="#ffffff" textAnchor="middle" letterSpacing="-4">MD</text>
                </svg>
                <span className="text-white/60 text-[11px] font-bold tracking-[0.2em] uppercase">MinD.md</span>
            </div>
            
            <div className="flex h-full pointer-events-auto">
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
