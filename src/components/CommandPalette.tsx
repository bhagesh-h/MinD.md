import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Command, Search, FileText, Plus, Settings, Sparkles, Hash, Download } from 'lucide-react';
import { Note } from '../types';
import { cn } from '../lib/utils';
import { getTagColor, useAppearance } from '../lib/appearance';
import Fuse from 'fuse.js';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onSelectNote: (id: string) => void;
  onAction: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  notes,
  onSelectNote,
  onAction
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const appearance = useAppearance(); // Trigger re-render on appearance update

  // Memoize Fuse instance - only rebuild when notes list changes, NOT on every keystroke
  const fuse = useMemo(() => new Fuse(notes, {
    keys: ['title', 'content', 'tags'],
    threshold: 0.3,
    includeScore: true,
  }), [notes]);

  const results = useMemo(() => {
    if (!query) return notes.slice(0, 5);
    if (query.startsWith('#')) {
      const tagQuery = query.slice(1).toLowerCase();
      return notes.filter(note =>
        note.tags.some(tag => tag.toLowerCase().includes(tagQuery))
      );
    }
    return fuse.search(query).map(r => r.item);
  }, [query, fuse, notes]);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        className="relative w-full max-w-4xl bg-[#111] border border-[#262626] rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-[#262626] flex items-center gap-3">
          <Search size={20} className="text-[#a3a3a3]" />
          <input
            autoFocus
            type="text"
            placeholder="Type to search notes or commands..."
            className="w-full bg-transparent border-none outline-none text-lg text-white placeholder-[#555] focus:ring-0"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => results.length > 0 ? Math.min(prev + 1, results.length - 1) : 0);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                if (results[selectedIndex]) {
                  onSelectNote(results[selectedIndex].id);
                  onClose();
                }
              } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
              }
            }}
          />
          <div className="px-2 py-1 bg-[#222] rounded text-[10px] text-[#a3a3a3]">ESC</div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-[#a3a3a3] uppercase tracking-wider">Notes</div>
              {results.map((note, idx) => (
                <button
                  key={note.id}
                  onClick={() => { onSelectNote(note.id); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left",
                    selectedIndex === idx ? "bg-[#2a2a2a] text-white" : "text-[#a3a3a3] hover:bg-[#1a1a1a]"
                  )}
                >
                  <FileText size={18} />
                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{note.title}</div>
                      <div className="flex gap-1">
                        {note.tags.map(tag => {
                          const color = getTagColor(tag);
                          return (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 rounded-md text-[11px] font-medium tracking-tight flex items-center"
                              style={{
                                backgroundColor: `${color}15`,
                                color: color,
                                borderColor: `${color}30`,
                                borderWidth: '1px'
                              }}
                            >
                              #{tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-xs opacity-60 truncate">{note.path}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[#a3a3a3] text-sm italic">
              No results found for "{query}"
            </div>
          )}

          <div className="mt-4 border-t border-[#262626] pt-2">
            <div className="px-3 py-1.5 text-[10px] font-bold text-[#a3a3a3] uppercase tracking-wider">Quick Actions</div>
            <div className="grid grid-cols-2 gap-1 px-1">
              <ActionBtn icon={Plus} label="New Note" onClick={() => onAction('new')} />
              <ActionBtn icon={Download} label="Export Note" onClick={() => onAction('export')} />
              <ActionBtn icon={Settings} label="Settings" onClick={() => onAction('settings')} />
              <ActionBtn icon={Hash} label="Search Tags" onClick={() => setQuery('#')} />
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#0a0a0a] border-t border-[#262626] flex items-center justify-between text-[10px] text-[#555]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-[#222] rounded text-white">↵</kbd> to select</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-[#222] rounded text-white">↑↓</kbd> to navigate</span>
          </div>
          <span>MinD.md v0.0.1</span>
        </div>
      </div>
    </div>
  );
};

const ActionBtn = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#262626] text-[#a3a3a3] hover:text-white text-xs"
  >
    <Icon size={14} />
    {label}
  </button>
);
