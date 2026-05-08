import React, { useState, useMemo } from 'react';
import { Plus, Search, Folder as FolderIcon, FileText, ChevronRight, ChevronDown, List, FolderPlus, Trash2, Tag, Check, X } from 'lucide-react';
import { Note, Folder } from '../types';
import { cn } from '../lib/utils';
import { getTagColor, useAppearance } from '../lib/appearance';

interface SidebarProps {
  notes: Note[];
  folders: Folder[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onAddNote: (folderId: string) => void;
  onAddFolder: (parentId: string | null) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onUpdateFolder: (id: string, updates: Partial<Folder>) => void;
  onDeleteNote: (id: string) => void;
  onDeleteFolder: (id: string) => void;
}

const SidebarFolderGraphic = ({ isOpen, hasFiles }: { isOpen: boolean, hasFiles: boolean }) => (
  <div className="relative w-4 h-3.5 flex items-center justify-center">
    <div className={cn(
      "absolute inset-x-0.5 top-0 bottom-0.5 bg-white/10 rounded-[2px] border border-white/10",
      isOpen ? "bg-white/30 border-white/30" : "bg-white/20"
    )}>
      <div className="absolute -top-[1.5px] left-[1px] w-2 h-0.5 bg-white/20 rounded-t-[0.5px] border-t border-x border-white/10"></div>
    </div>
    {hasFiles && (
      <div className="w-2.5 h-1.8 bg-white rounded-[0.5px] border border-white/20 rotate-1 relative z-10 shadow-sm scale-90 flex items-center justify-center">
         <span className="text-[4px] font-black scale-75 text-black">MD</span>
      </div>
    )}
    <div className="absolute inset-x-0.5 top-[5px] bottom-0.5 bg-white/20 border-t border-white/10 rounded-b-[2px] z-20 backdrop-blur-[0.5px]"></div>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ notes, folders, activeNoteId, onSelectNote, onAddNote, onAddFolder, onUpdateNote, onUpdateFolder, onDeleteNote, onDeleteFolder }) => {
  const [sidebarTab, setSidebarTab] = useState<'files' | 'tags'>('files');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const appearance = useAppearance();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const toggleFolder = (id: string) => {
    const next = new Set(expandedFolders);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedFolders(next);
  };

  const allTags = useMemo(() => {
    const tagsMap: Record<string, number> = {};
    notes.forEach(note => {
        note.tags.forEach(tag => {
            tagsMap[tag] = (tagsMap[tag] || 0) + 1;
        });
    });
    return Object.entries(tagsMap).sort((a, b) => b[1] - a[1]);
  }, [notes]);

  const filteredTags = allTags.filter(([tag]) => 
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const notesByTag = (tag: string) => notes.filter(n => n.tags.includes(tag));

  const renderFolder = (folder: Folder) => {
    const isOpen = expandedFolders.has(folder.id);
    return (
      <div key={folder.id} className="mb-0.5">
        <div 
          className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-white/[0.03] cursor-pointer group"
          onClick={() => toggleFolder(folder.id)}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-3 flex items-center justify-center shrink-0">
              {isOpen ? 
                <ChevronDown size={11} className="text-white group-hover:text-white" /> : 
                <ChevronRight size={11} className="text-white group-hover:text-white" />
              }
            </div>
            <SidebarFolderGraphic isOpen={isOpen} hasFiles={folder.noteIds.length > 0} />
            {renamingId === folder.id ? (
                <input 
                    autoFocus
                    className="bg-[#222] border border-white/20 text-white text-[12px] rounded px-1 w-full outline-none"
                    value={newName}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={() => setRenamingId(null)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onUpdateFolder(folder.id, { name: newName });
                            setRenamingId(null);
                        }
                    }}
                />
            ) : (
                <span 
                    onDoubleClick={(e) => { e.stopPropagation(); setRenamingId(folder.id); setNewName(folder.name); }}
                    className={cn("text-[13px] tracking-tight truncate", isOpen ? "font-medium text-white" : "text-white group-hover:text-white")}
                >
                    {folder.name}
                </span>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0">
             <button 
                onClick={(e) => { e.stopPropagation(); onAddNote(folder.id); if(!isOpen) toggleFolder(folder.id); }} 
                className="p-1 hover:bg-[#333] rounded text-[#a3a3a3] hover:text-white"
                title="New Note"
              >
                <Plus size={12} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onAddFolder(folder.id); if(!isOpen) toggleFolder(folder.id); }} 
                className="p-1 hover:bg-[#333] rounded text-[#a3a3a3] hover:text-white"
                title="New Subfolder"
              >
                <FolderPlus size={12} />
             </button>
             {folder.id !== 'root' && (
               confirmDeleteId === `folder-${folder.id}` ? (
                 <div className="flex items-center gap-[2px] bg-[#111] px-1 py-[2px] rounded border border-white/10 shadow-sm z-10 w-fit">
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest pl-1 leading-none mr-0.5">Sure?</span>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); setConfirmDeleteId(null); }} className="hover:bg-red-500 hover:text-white text-red-400 rounded-sm p-[2px] transition-colors"><Check size={10} strokeWidth={3} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }} className="hover:bg-white/10 text-white/50 hover:text-white rounded-sm p-[2px] transition-colors"><X size={10} strokeWidth={3} /></button>
                 </div>
               ) : (
                <button 
                   onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(`folder-${folder.id}`); }} 
                   className="p-1 hover:bg-red-500/20 rounded text-red-400 opacity-60 hover:opacity-100"
                   title="Delete Folder"
                 >
                   <Trash2 size={12} />
                </button>
               )
             )}
          </div>
        </div>

        {isOpen && (
          <div className="pl-4 mt-0.5 space-y-0.5 relative before:content-[''] before:absolute before:left-[11px] before:top-0 before:bottom-4 before:w-px before:bg-[#262626]">
            {folder.childIds.map(childId => {
              const childFolder = folders.find(f => f.id === childId);
              return childFolder ? renderFolder(childFolder) : null;
            })}

            {folder.noteIds.map(noteId => {
              const note = notes.find(n => n.id === noteId);
              if (!note) return null;
              if (searchQuery && !note.title.toLowerCase().includes(searchQuery.toLowerCase())) return null;

              return (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note.id)}
                  className={cn(
                    "flex items-center justify-between py-1 px-2 rounded-md cursor-pointer group relative",
                    activeNoteId === note.id ? "bg-[#2a2a2a] text-white" : "text-white hover:bg-white/[0.05] hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2 relative w-full pr-6 overflow-hidden text-ellipsis">
                     <div className="absolute -left-[13px] top-1/2 w-[10px] h-px bg-white/20"></div>
                     <FileText size={14} className={cn("shrink-0", activeNoteId === note.id ? "text-white" : "text-white/60 group-hover:text-white")} />
                     {renamingId === note.id ? (
                         <input 
                            autoFocus
                            className="bg-[#333] border border-white/20 text-white text-[12px] rounded px-1 w-full outline-none"
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
                            className="text-sm truncate w-full"
                        >
                            {note.title}
                        </span>
                     )}
                     {confirmDeleteId === `note-${note.id}` ? (
                         <div className="absolute right-0 flex items-center gap-[2px] bg-[#111] px-1 py-[2px] rounded-l border-y border-l border-white/10 shadow-sm z-10 w-fit">
                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest pl-1 leading-none mr-0.5">Sure?</span>
                            <button onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); setConfirmDeleteId(null); }} className="hover:bg-red-500 hover:text-white text-red-400 rounded-sm p-[2px] transition-colors"><Check size={10} strokeWidth={3} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }} className="hover:bg-white/10 text-white/50 hover:text-white rounded-sm p-[2px] transition-colors"><X size={10} strokeWidth={3} /></button>
                         </div>
                     ) : (
                         <button 
                            onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(`note-${note.id}`); }}
                            className="absolute right-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-red-400"
                            title="Delete Note"
                         >
                            <Trash2 size={12} />
                         </button>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = folders.filter(f => f.parentId === null);

  return (
    <aside className="w-full h-full flex flex-col border-r border-[#262626] bg-[#111111] shrink-0">
      <div className="p-4 flex items-center justify-between border-b border-[#262626] h-[65px] gap-4">
        <div className="relative flex items-center flex-1 h-9 rounded-lg bg-[#0a0a0a] border border-[#262626] px-3 focus-within:border-white/20 leading-none">
          <Search size={14} className="text-white/30 mr-2 shrink-0" />
          <input
            type="text"
            placeholder={sidebarTab === 'files' ? "Search files..." : "Search tags..."}
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-white/30 p-0 focus:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 text-[#a3a3a3] shrink-0">
          <button onClick={() => onAddNote('root')} className="p-1.5 hover:text-white hover:bg-[#262626] rounded-md" title="New Note">
            <Plus size={16} />
          </button>
          <button onClick={() => onAddFolder(null)} className="p-1.5 hover:text-white hover:bg-[#262626] rounded-md" title="New Root Folder">
            <FolderPlus size={16} />
          </button>
        </div>
      </div>



      <div className="p-3 flex gap-1 border-b border-[#262626]">
        <button 
            onClick={() => setSidebarTab('files')}
            className={cn(
                "flex-1 py-1.5 text-[11px] font-semibold rounded-md flex items-center justify-center",
                sidebarTab === 'files' ? "bg-[#222] text-white shadow-inner border border-white/5" : "text-[#555] hover:text-white hover:bg-[#1a1a1a]"
            )}
        >
            Folders
        </button>
        <button 
            onClick={() => setSidebarTab('tags')}
            className={cn(
                "flex-1 py-1.5 text-[11px] font-semibold rounded-md flex items-center justify-center",
                sidebarTab === 'tags' ? "bg-[#222] text-white shadow-inner border border-white/5" : "text-[#555] hover:text-white hover:bg-[#1a1a1a]"
            )}
        >
            Tags
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin pb-20">
        {sidebarTab === 'files' ? (
            rootFolders.map(folder => renderFolder(folder))
        ) : (
            <div className="space-y-4 pt-2">
                {filteredTags.map(([tag, count]) => {
                    const isOpen = expandedFolders.has(`tag-${tag}`);
                    const tagNotes = notesByTag(tag);
                    const color = getTagColor(tag);
                    
                    return (
                        <div key={tag} className="space-y-1">
                            <button 
                                onClick={() => {
                                    const next = new Set(expandedFolders);
                                    if (next.has(`tag-${tag}`)) next.delete(`tag-${tag}`);
                                    else next.add(`tag-${tag}`);
                                    setExpandedFolders(next);
                                }}
                                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-white/[0.03] group"
                                style={{ color: color }}
                            >
                                <div className="flex items-center gap-2">
                                    <Tag size={13} style={{ color: color, opacity: 0.6 }} />
                                    <span className="text-[13px] font-medium tracking-tight">#{tag}</span>
                                </div>
                                <span 
                                    className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded-md",
                                        isOpen ? "border shadow-lg shadow-black/20" : "bg-white/5 border border-white/5"
                                    )}
                                    style={isOpen ? { 
                                        backgroundColor: `${color}20`, 
                                        borderColor: `${color}40`,
                                        color: color 
                                    } : { 
                                        color: `${color}CC` 
                                    }}
                                >
                                    {count}
                                </span>
                            </button>
                            
                            {isOpen && (
                                <div className="pl-4 mt-1 space-y-0.5 border-l border-white/5 ml-4">
                                    {tagNotes.map(note => (
                                        <div 
                                            key={note.id}
                                            onClick={() => onSelectNote(note.id)}
                                            className={cn(
                                                "flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer",
                                                activeNoteId === note.id ? "bg-[#2a2a2a] text-white" : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                                            )}
                                        >
                                            <FileText size={12} className="shrink-0 opacity-40" />
                                            <span className="text-[13px] truncate">{note.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
                {filteredTags.length === 0 && (
                    <div className="p-8 text-center text-white/20 text-xs uppercase tracking-widest leading-relaxed">
                        No tags found.<br/>Add tags in the note header.
                    </div>
                )}
            </div>
        )}
      </div>
    </aside>
  );
};
