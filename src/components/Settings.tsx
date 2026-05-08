import React, { useState, useEffect } from 'react';
import { SyncSettings } from '../types';
import { Save, RefreshCw, Folder, Palette, Github, Key } from 'lucide-react';
import { cn } from '../lib/utils';

export const SettingsComponent: React.FC = () => {
  const [settings, setSettings] = useState<SyncSettings>({
    defaultStoragePath: localStorage.getItem('defaultStoragePath') || '~/documents/markdown',
    appearanceConfigPath: localStorage.getItem('appearanceConfigPath') || '~/config/plots.json',
    syncRepository: localStorage.getItem('syncRepository') || '',
    // @ts-ignore
    githubToken: localStorage.getItem('githubToken') || '',
    autoSyncInterval: parseInt(localStorage.getItem('autoSyncInterval') || '0', 10),
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('defaultStoragePath', settings.defaultStoragePath);
    localStorage.setItem('appearanceConfigPath', settings.appearanceConfigPath);
    localStorage.setItem('syncRepository', settings.syncRepository);
    // @ts-ignore
    localStorage.setItem('githubToken', settings.githubToken || '');
    localStorage.setItem('autoSyncInterval', (settings.autoSyncInterval || 0).toString());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // Dispatch event to trigger sync if repository changed
    window.dispatchEvent(new CustomEvent('sync-repository'));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] text-white p-6 overflow-y-auto">
      <div className="w-full">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Settings</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-widest">Configuration & Persistence</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Storage Section */}
            <section className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-white/80 border-b border-white/10 pb-2">
                <Folder size={14} className="text-white" />
                <h2 className="text-sm font-semibold">Storage</h2>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Default Markdown Path</label>
                <input
                  type="text"
                  value={settings.defaultStoragePath}
                  onChange={(e) => setSettings({ ...settings, defaultStoragePath: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg h-8 px-3 text-sm focus:border-white/50 focus:ring-0 outline-none transition-all"
                  placeholder="e.g. ~/documents/markdown"
                />
                <p className="text-[9px] text-white/20 italic">Absolute path to your local markdown stash.</p>
              </div>
            </section>

            {/* Appearance Config Section */}
            <section className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-white/80 border-b border-white/10 pb-2">
                <Palette size={14} className="text-white" />
                <h2 className="text-sm font-semibold">Plot Appearance</h2>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Theme Config JSON Path</label>
                <input
                  type="text"
                  value={settings.appearanceConfigPath}
                  onChange={(e) => setSettings({ ...settings, appearanceConfigPath: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg h-8 px-3 text-sm focus:border-white/50 focus:ring-0 outline-none transition-all"
                  placeholder="e.g. ~/config/plots.json"
                />
                <p className="text-[9px] text-white/20 italic">JSON file to override Mermaid & Plotly color schemes.</p>
              </div>
            </section>
          </div>

          {/* Sync Section */}
          <section className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-white/80 border-b border-white/10 pb-2">
              <RefreshCw size={14} className="text-white" />
              <h2 className="text-sm font-semibold">Sync Engine</h2>
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Repository URL</label>
                <div className="relative flex items-center">
                  <Github size={12} className="text-white/30 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={settings.syncRepository}
                    onChange={(e) => setSettings({ ...settings, syncRepository: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg h-8 pl-8 pr-3 text-sm focus:border-white/50 focus:ring-0 outline-none transition-all"
                    placeholder="https://github.com/username/notes.git"
                  />
                </div>
                <p className="text-[9px] text-white/20 italic">Remote repository for cloud-sync and version control.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">GitHub Token</label>
                <div className="relative flex items-center">
                  <Key size={12} className="text-white/30 absolute left-3 pointer-events-none" />
                  <input
                    type="password"
                    // @ts-ignore
                    value={settings.githubToken}
                    onChange={(e) => setSettings({ ...settings, githubToken: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg h-8 pl-8 pr-3 text-sm focus:border-white/50 focus:ring-0 outline-none transition-all"
                    placeholder="ghp_xxxxxxxxxxxx"
                  />
                </div>
                <p className="text-[9px] text-white/20 italic">PAT required for pushing individual files.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Auto Sync Interval (Min)</label>
                <div className="relative flex items-center">
                  <RefreshCw size={12} className="text-white/30 absolute left-3 pointer-events-none" />
                  <input
                    type="number"
                    min="0"
                    value={settings.autoSyncInterval}
                    onChange={(e) => setSettings({ ...settings, autoSyncInterval: parseInt(e.target.value) || 0 })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg h-8 pl-8 pr-3 text-sm focus:border-white/50 focus:ring-0 outline-none transition-all"
                    placeholder="0 to disable"
                  />
                </div>
                <p className="text-[9px] text-white/20 italic">Set to 0 to disable automatic synchronization.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="pt-6 flex items-center justify-between border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-sm text-white/40 font-mono">Build: 1.0.4-stable</span>
            <span className="text-xs text-emerald-500/80 uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              Stable Version
            </span>
          </div>
          <button
            onClick={handleSave}
            className={cn(
              "px-6 h-10 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xl",
              saved ? "bg-white text-black" : "bg-white/10 border border-white/10 hover:bg-white/20 text-white"
            )}
          >
            {saved ? (
              <>Success</>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
