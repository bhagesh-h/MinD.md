import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { TitleBar } from './components/TitleBar';
import { NavRail } from './components/NavRail';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { CommandPalette } from './components/CommandPalette';
import { useVault } from './hooks/useVault';
import { useAppearance } from './lib/appearance';
import { AppMode } from './types';

// Lazy load heavy components
const Home = lazy(() => import('./components/Home').then(m => ({ default: m.Home })));
const SettingsComponent = lazy(() => import('./components/Settings').then(m => ({ default: m.SettingsComponent })));
const AppearanceEditor = lazy(() => import('./components/AppearanceEditor').then(m => ({ default: m.AppearanceEditor })));
const About = lazy(() => import('./components/About').then(m => ({ default: m.About })));
const Help = lazy(() => import('./components/Help').then(m => ({ default: m.Help })));

const LoadingView = () => (
  <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
    <div className="w-8 h-8 border-2 border-white/5 border-t-white/40 rounded-full animate-spin" />
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { notes, folders, activeNote, setActiveNoteId, updateNote, createNote, createFolder, updateFolder, deleteNote, deleteFolder } = useVault();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const config = useAppearance();

  useEffect(() => {
    // Inject custom colors as CSS variables
    const root = document.documentElement;
    if (config.colors) {
      Object.entries(config.colors).forEach(([key, value]) => {
        if (typeof value === 'string') {
          // Extract hex if it contains the icon string like "🟦 #7dd3fc"
          const hexMatch = value.match(/#[A-Fa-f0-9]{3,6}/);
          const colorValue = hexMatch ? hexMatch[0] : value;
          root.style.setProperty(`--app-${key}`, colorValue);
        }
      });
    }

    if (config.callouts) {
      Object.entries(config.callouts).forEach(([key, props]: [string, any]) => {
        if (props.background) root.style.setProperty(`--callout-${key}-bg`, props.background);
        if (props.text) root.style.setProperty(`--callout-${key}-text`, props.text);
        if (props.border) root.style.setProperty(`--callout-${key}-border`, props.border);
      });
    }
  }, [config]);

  const handleVaultClick = () => {
    if (activeTab === 'vault') {
      setSidebarVisible(!sidebarVisible);
    } else {
      setActiveTab('vault');
      setSidebarVisible(true);
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Use e.code as secondary check for keyboard layouts where 'k' might not match
      if ((e.key === 'k' || e.code === 'KeyK') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleAction = (action: string) => {
    if (action === 'new') {
        createNote('root');
        setIsCommandPaletteOpen(false);
        setActiveTab('vault');
    } else if (action === 'settings') {
        setActiveTab('settings');
        setIsCommandPaletteOpen(false);
    } else if (action === 'export') {
        setIsCommandPaletteOpen(false);
        if (activeTab !== 'vault') {
            setActiveTab('vault');
        }
        setTimeout(() => window.dispatchEvent(new CustomEvent('export-active-note')), 100);
    }
  };

  const handleSelectNoteFromHome = (id: string) => {
     setActiveNoteId(id);
     setActiveTab('vault');
  };

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] flex flex-col font-sans overflow-hidden">
        <TitleBar />
        <div className="flex-1 flex overflow-hidden w-full">
            <NavRail 
              activeTab={activeTab} 
          onTabChange={(tab) => {
            if (tab === 'vault') handleVaultClick();
            else {
              setActiveTab(tab);
              setSidebarVisible(false);
            }
          }} 
        />

        {activeTab === 'vault' && sidebarVisible && (
          <div className="overflow-hidden h-full border-r border-white/5 w-[280px] shrink-0">
            <Sidebar 
              notes={notes} 
              folders={folders} 
              activeNoteId={activeNote?.id || null} 
              onSelectNote={setActiveNoteId}
              onAddNote={(folderId) => createNote(folderId)}
              onAddFolder={(parentId) => createFolder(parentId)}
              onUpdateNote={updateNote}
              onUpdateFolder={updateFolder}
              onDeleteNote={deleteNote}
              onDeleteFolder={deleteFolder}
            />
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
           <Suspense fallback={<LoadingView />}>
              {activeTab === 'home' ? (
                 <Home 
                   notes={notes} 
                   folders={folders} 
                   onSelectNote={handleSelectNoteFromHome} 
                   onSelectFolder={() => { setActiveTab('vault'); setSidebarVisible(true); }}
                   onUpdateFolder={updateFolder}
                   onUpdateNote={updateNote}
                   onDeleteNote={deleteNote}
                   onDeleteFolder={deleteFolder}
                 />
              ) : activeTab === 'settings' ? (
                 <SettingsComponent />
              ) : activeTab === 'appearance' ? (
                 <AppearanceEditor />
              ) : activeTab === 'about' ? (
                 <About />
              ) : activeTab === 'help' ? (
                 <Help />
              ) : (
                 <Editor 
                   note={activeNote} 
                   notes={notes}
                   onUpdate={updateNote} 
                   onSelectNote={setActiveNoteId}
                 />
              )}
           </Suspense>
        </div>
      </div>

      <CommandPalette 
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          notes={notes}
          onSelectNote={handleSelectNoteFromHome}
          onAction={handleAction}
        />

        {/* Global Keyboard Shortcut Hint */}
        <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="absolute bottom-20 right-8 opacity-40 hover:opacity-100 flex items-center gap-2 text-[10px] text-white uppercase tracking-widest px-4 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full border border-white/10 z-50 shadow-2xl cursor-pointer"
        >
            <div className="flex items-center gap-1.5">
                <span className="opacity-80">Cntrl + k</span>
            </div>
            <div className="w-px h-3 bg-white/10 mx-1" />
            <span className="font-semibold">Finder</span>
        </button>

        <Toaster theme="dark" position="bottom-right" className="font-sans" />
    </div>
  );
}
