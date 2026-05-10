import React from 'react';
import { FileText, Folder as FolderIcon, Trash2, Check, X } from 'lucide-react';
import { Note, Folder } from '../types';

import { getTagColor, useAppearance } from '../lib/appearance';

interface HomeProps {
  notes: Note[];
  folders: Folder[];
  onSelectNote: (id: string) => void;
  onSelectFolder: (id: string) => void;
  onUpdateFolder: (id: string, updates: Partial<Folder>) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  onDeleteFolder: (id: string) => void;
}

const FolderGraphic = ({ hasFiles }: { hasFiles: boolean }) => (
  <div className="w-16 h-12 relative flex items-center justify-center">
    {/* Back flap */}
    <div className="absolute inset-x-2 top-0 bottom-2 bg-white/[0.08] rounded-lg border border-white/10 shadow-lg group-hover:bg-white/10">
      <div className="absolute -top-1 left-1 w-8 h-2 bg-white/[0.08] rounded-t-sm border-t border-x border-white/10"></div>
    </div>
    
    {hasFiles && (
      <div className="relative z-10 w-11 h-8 bg-white rounded-[1px] shadow-xl border border-black/5 flex flex-col p-1.5 gap-1 rotate-2 translate-y-[-2px]">
        <div className="absolute top-1 right-1 flex items-center justify-center scale-[0.6]">
           <span className="text-[10px] font-black italic text-black bg-white px-0.5 rounded-sm border border-black/10">MD</span>
        </div>
        <div className="w-[60%] h-[1px] bg-black/10" />
        <div className="w-[40%] h-[1px] bg-black/10" />
        <div className="w-[80%] h-[1px] bg-black/10" />
        <div className="w-[70%] h-[1px] bg-black/10" />
      </div>
    )}

    {/* Front flap */}
    <div className="absolute inset-x-2 top-4 bottom-2 bg-white/5 rounded-lg border-t border-white/10 backdrop-blur-[6px] z-20"></div>
  </div>
);

export const Home: React.FC<HomeProps> = ({ notes, folders, onSelectNote, onSelectFolder, onUpdateFolder, onUpdateNote, onDeleteNote, onDeleteFolder }) => {
  const [renamingId, setRenamingId] = React.useState<string | null>(null);
  const [newName, setNewName] = React.useState("");
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const appearance = useAppearance();

  // Memoize file stats to avoid re-computing Blob sizes on every render
  const noteStats = React.useMemo(() => {
    const statsMap: Record<string, { size: string; wordCount: number; lineCount: number }> = {};
    notes.forEach(note => {
      statsMap[note.id] = {
        size: (new Blob([note.content]).size / 1024).toFixed(1),
        wordCount: note.content.split(/\s+/).filter(Boolean).length,
        lineCount: note.content.split('\n').length,
      };
    });
    return statsMap;
  }, [notes]);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a] scrollbar-thin">
      {/* Folders Section */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold mb-8 text-white tracking-tight">Folders</h3>
        <div className="flex flex-wrap gap-4 sm:gap-6">
          {folders.map(folder => (
            <div key={folder.id} className="flex flex-col items-center group relative w-24 sm:w-28 mb-2">
              {confirmDeleteId === `folder-${folder.id}` ? (
                 <div className="absolute -top-3 -right-3 flex items-center gap-[2px] bg-[#111] px-1 py-[2px] rounded-full border border-white/10 shadow-xl z-40 w-fit">
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest pl-1 leading-none mr-0.5">Sure?</span>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); setConfirmDeleteId(null); }} className="hover:bg-red-500 hover:text-white text-red-400 rounded-full p-1 transition-colors"><Check size={10} strokeWidth={3} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }} className="hover:bg-white/10 text-white/50 hover:text-white rounded-full p-1 transition-colors"><X size={10} strokeWidth={3} /></button>
                 </div>
              ) : (
                <button 
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(`folder-${folder.id}`); }}
                  className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 p-1.5 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-full z-30 border border-white/5 shadow-md transition-all"
                  title="Delete Folder"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <div 
                onClick={() => onSelectFolder(folder.id)}
                className="w-full h-20 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all mb-2"
              >
                <div className="group-hover:scale-110 transition-transform">
                  <FolderGraphic hasFiles={folder.noteIds.length > 0} />
                </div>
              </div>

              <div className="text-center w-full px-1">
                {renamingId === folder.id ? (
                    <input 
                        autoFocus
                        className="bg-[#222] border border-white/20 text-white text-xs rounded px-1 w-full text-center outline-none"
                        value={newName}
                        onBlur={() => setRenamingId(null)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onUpdateFolder(folder.id, { name: newName });
                                setRenamingId(null);
                            }
                        }}
                    />
                ) : (
                    <>
                        <h4 
                            onDoubleClick={() => { setRenamingId(folder.id); setNewName(folder.name); }}
                            className="text-xs font-semibold text-white/90 group-hover:text-white truncate mb-0.5 cursor-default transition-colors"
                        >
                            {folder.name}
                        </h4>
                        <p className="text-[10px] uppercase tracking-tighter text-white/50 font-medium">{folder.noteIds.length} Files</p>
                    </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Files Section */}
      <section>
        <h3 className="text-xl font-semibold mb-6 text-white tracking-tight">Recent Files</h3>
        <div className="bg-[#111]/30 rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/[0.05] text-[10px] font-bold text-white uppercase tracking-widest">
            <div className="col-span-8">Name</div>
            <div className="col-span-1 text-center">Size</div>
            <div className="col-span-3 text-right">Last Modified</div>
          </div>
          
          <div className="flex flex-col">
            {notes.slice(0, 10).map(note => {
              const stats = noteStats[note.id] || { size: '0.0', wordCount: 0, lineCount: 0 };
              return (
                <div 
                  key={note.id}
                  onClick={() => onSelectNote(note.id)}
                  className="grid grid-cols-12 gap-4 p-4 items-center border-b border-white/[0.05] hover:bg-white/[0.03] cursor-pointer group last:border-0"
                >
                  <div className="col-span-8 flex items-center gap-3">
                    <FileText size={16} className="text-white/60 group-hover:text-white shrink-0" />
                    <div className="flex flex-1 items-center gap-3 overflow-hidden">
                        {renamingId === note.id ? (
                            <input 
                                autoFocus
                                className="bg-[#222] border border-white/20 text-white text-[13px] rounded px-1 w-full outline-none"
                                value={newName}
                                onClick={(e) => e.stopPropagation()}
                                onBlur={() => setRenamingId(null)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onUpdateNote(note.id, { title: newName });
                                        setRenamingId(null);
                                    }
                                }}
                            />
                        ) : (
                            <span 
                                onDoubleClick={(e) => { e.stopPropagation(); setRenamingId(note.id); setNewName(note.title); }}
                                className="text-sm text-white truncate shrink-0"
                            >
                                {note.title}
                            </span>
                        )}
                        <div className="flex flex-wrap gap-1 overflow-hidden">
                            {note.tags.slice(0, 3).map(tag => {
                                const color = getTagColor(tag);
                                return (
                                    <span 
                                        key={tag} 
                                        className="px-2 py-0.5 rounded-md text-[13px] font-medium tracking-tight shrink-0 flex items-center"
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
                            {note.tags.length > 3 && (
                                <span className="text-[9px] text-white/40">+{note.tags.length - 3}</span>
                            )}
                        </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-center text-[11px] text-white/60 group-hover:text-white">
                    {stats.size} KB
                  </div>
                  <div className="col-span-3 text-right text-xs text-white/60 flex items-center justify-end gap-3 group-hover:text-white">
                    {new Date(note.updatedAt).toLocaleDateString()}
                    {confirmDeleteId === `note-${note.id}` ? (
                       <div className="flex items-center gap-[2px] bg-[#111] px-1 py-[2px] rounded border border-white/10 shadow-sm z-10 w-fit">
                          <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest pl-1 leading-none mr-0.5">Sure?</span>
                          <button onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); setConfirmDeleteId(null); }} className="hover:bg-red-500 hover:text-white text-red-400 rounded-sm p-[2px] transition-colors"><Check size={12} strokeWidth={3} /></button>
                          <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }} className="hover:bg-white/10 text-white/50 hover:text-white rounded-sm p-[2px] transition-colors"><X size={12} strokeWidth={3} /></button>
                       </div>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(`note-${note.id}`); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-md text-red-500/60 hover:text-red-500 transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
