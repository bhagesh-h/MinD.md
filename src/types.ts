export interface Note {
  id: string;
  title: string;
  content: string;
  path: string;
  parentId: string | null;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
  metadata?: Record<string, any>;
  sha?: string;
  githubPath?: string;
  branch?: string;
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  childIds: string[];
  noteIds: string[];
}

export interface Workspace {
  id: string;
  name: string;
  rootPath: string;
}

export interface SyncSettings {
  defaultStoragePath: string;
  appearanceConfigPath: string;
  syncRepository: string;
  githubToken?: string;
  autoSyncInterval?: number; // in minutes
}

export enum AppMode {
  NORMAL = 'normal',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
