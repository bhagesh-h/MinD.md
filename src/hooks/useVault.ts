import React, { useState, useEffect, useMemo } from 'react';
import { Note, Folder } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { parseGithubUrl, fetchGithubRepo } from '../lib/github';

export function useVault() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Initialize with some dummy data if empty
  useEffect(() => {
    const initVault = async () => {
      const syncRepository = localStorage.getItem('syncRepository');
      const savedNotes = localStorage.getItem('MinD-md-notes');
      const savedFolders = localStorage.getItem('MinD-md-folders');

      if (syncRepository) {
        const repoParams = parseGithubUrl(syncRepository);
        if (repoParams) {
          try {
            const defaultPath = localStorage.getItem('defaultStoragePath') || '~/documents/markdown';
            const { folders: ghFolders, notes: ghNotes } = await fetchGithubRepo(repoParams.owner, repoParams.repo, defaultPath);
            setFolders(ghFolders);
            setNotes(ghNotes);
            if (ghNotes.length > 0 && !activeNoteId) {
              setActiveNoteId(ghNotes[0].id);
            }
            return;
          } catch (error) {
            console.error("Failed to fetch initial sync repository, falling back to local storage.", error);
          }
        }
      }

      if (savedNotes && savedFolders) {
        setNotes(JSON.parse(savedNotes));
        setFolders(JSON.parse(savedFolders));
      } else {
        // Default mock data
        const welcomeNote: Note = {
          id: 'welcome',
          title: 'Welcome to MinD.md',
          content: '# Welcome to MinD.md\n\nThis is your local-first markdown power tool.\n\n## Features\n- **GFM Support**: Tables, task lists, and more.\n- **Math**: $E=mc^2$\n- **Code**: Highlighting via Shiki/Prism.\n\nStart by creating a new note in the sidebar.',
          path: '/welcome.md',
          parentId: 'root',
          tags: ['onboarding'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const rootFolder: Folder = {
          id: 'root',
          name: 'My Vault',
          path: '/',
          parentId: null,
          childIds: [],
          noteIds: ['welcome'],
        };

        setNotes([welcomeNote]);
        setFolders([rootFolder]);
        setActiveNoteId('welcome');
      }
    };
    initVault();
  }, []);

  useEffect(() => {
    let intervalId: any = null;

    const runSync = async () => {
      const repoUrl = localStorage.getItem('syncRepository');
      if (repoUrl) {
        const repoParams = parseGithubUrl(repoUrl);
        if (repoParams) {
          try {
            const defaultPath = localStorage.getItem('defaultStoragePath') || '~/documents/markdown';
            const { folders: ghFolders, notes: ghNotes } = await fetchGithubRepo(repoParams.owner, repoParams.repo, defaultPath);
            setFolders(ghFolders);
            setNotes(ghNotes);
            if (ghNotes.length > 0) {
              setActiveNoteId(ghNotes[0].id);
            }
          } catch (error) {
            console.error('Failed to sync repository:', error);
          }
        }
      }
    };

    const setupInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      const intervalMinutes = parseInt(localStorage.getItem('autoSyncInterval') || '0', 10);
      if (intervalMinutes > 0) {
        intervalId = setInterval(runSync, intervalMinutes * 60 * 1000);
      }
    };

    const handleSyncEvent = () => {
      runSync();
      setupInterval();
    };

    window.addEventListener('sync-repository', handleSyncEvent);
    setupInterval(); // Initial setup

    return () => {
      window.removeEventListener('sync-repository', handleSyncEvent);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (notes.length === 0) return;
    
    // Debounce the heavy JSON stringify and localStorage IO
    const handler = setTimeout(() => {
      localStorage.setItem('MinD-md-notes', JSON.stringify(notes));
      localStorage.setItem('MinD-md-folders', JSON.stringify(folders));
    }, 1000);
    
    return () => clearTimeout(handler);
  }, [notes, folders]);

  const activeNote = useMemo(() => notes.find(n => n.id === activeNoteId), [notes, activeNoteId]);

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
  };

  const createNote = (parentId: string, title: string = 'Untitled') => {
    const constructGithubPath = (fid: string): string => {
      const f = folders.find(folder => folder.id === fid);
      if (!f || f.id === 'root') return '';
      return constructGithubPath(f.parentId as string) + f.name + '/';
    };

    const fileName = `${title.toLowerCase().replace(/ /g, '-')}.md`;
    const githubPathDir = constructGithubPath(parentId);
    const githubPath = `${githubPathDir}${fileName}`;

    const parentFolder = folders.find(f => f.id === parentId);
    const localDir = parentFolder ? parentFolder.path : '/';
    const localPath = `${localDir}${localDir.endsWith('/') ? '' : '/'}${fileName}`;

    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content: `# ${title}`,
      path: localPath,
      githubPath,
      parentId,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes(prev => [...prev, newNote]);
    setFolders(prev => prev.map(f => f.id === parentId ? { ...f, noteIds: [...f.noteIds, newNote.id] } : f));
    setActiveNoteId(newNote.id);
    return newNote;
  };

  const createFolder = (parentId: string | null, name: string = 'New Folder') => {
    const newFolder: Folder = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      path: parentId ? `${folders.find(f => f.id === parentId)?.path || ''}${name}/` : `/${name}/`,
      parentId,
      childIds: [],
      noteIds: [],
    };

    setFolders(prev => {
      const next = [...prev, newFolder];
      if (parentId) {
        return next.map(f => f.id === parentId ? { ...f, childIds: [...f.childIds, newFolder.id] } : f);
      }
      return next;
    });

    return newFolder;
  };

  const updateFolder = (id: string, updates: Partial<Folder>) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setFolders(prev => prev.map(f => ({
      ...f,
      noteIds: f.noteIds.filter(nid => nid !== id)
    })));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  };

  const deleteFolder = (id: string) => {
    if (id === 'root') return;

    // Helper to get all nested note and folder IDs
    const collectIds = (fid: string, allFolders: Folder[]): { noteIds: string[], folderIds: string[] } => {
      const folder = allFolders.find(f => f.id === fid);
      if (!folder) return { noteIds: [], folderIds: [] };

      let noteIds = [...folder.noteIds];
      let folderIds = [fid];

      folder.childIds.forEach(cid => {
        const nested = collectIds(cid, allFolders);
        noteIds = [...noteIds, ...nested.noteIds];
        folderIds = [...folderIds, ...nested.folderIds];
      });

      return { noteIds, folderIds };
    };

    const { noteIds: noteIdsToDelete, folderIds: folderIdsToDelete } = collectIds(id, folders);

    setNotes(prev => prev.filter(n => !noteIdsToDelete.includes(n.id)));
    setFolders(prev => {
      // Find parent to remove child reference
      const target = prev.find(f => f.id === id);
      let next = prev.filter(f => !folderIdsToDelete.includes(f.id));
      if (target && target.parentId) {
        next = next.map(f => f.id === target.parentId ? {
          ...f,
          childIds: f.childIds.filter(cid => cid !== id)
        } : f);
      }
      return next;
    });

    if (activeNoteId && noteIdsToDelete.includes(activeNoteId)) {
      setActiveNoteId(null);
    }
  };

  return {
    notes,
    folders,
    activeNote,
    setActiveNoteId,
    updateNote,
    deleteNote,
    createNote,
    createFolder,
    updateFolder,
    deleteFolder,
    togglePin
  };
}
