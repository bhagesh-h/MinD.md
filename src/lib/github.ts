import { Note, Folder } from '../types';

export const parseGithubUrl = (url: string) => {
  if (!url) return null;
  const match = url.match(/github\.com\/([^\/]+)\/([^/.]+)(?:\.git)?/);
  if (match) {
    return { owner: match[1], repo: match[2] };
  }
  return null;
};

export const pushGithubFile = async (owner: string, repo: string, path: string, content: string, branch: string, sha?: string) => {
  const token = localStorage.getItem('githubToken');
  if (!token) {
    throw new Error('Please set your GitHub Personal Access Token in Settings.');
  }

  const encodedContent = btoa(unescape(encodeURIComponent(content)));

  const body: any = {
    message: `Update ${path}`,
    content: encodedContent,
    branch: branch || 'main'
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to push file to GitHub');
  }

  const data = await response.json();
  return data.content.sha;
};

export const fetchGithubRepo = async (owner: string, repo: string, defaultPath: string) => {
  const token = localStorage.getItem('githubToken');
  const headers = token ? { 'Authorization': `token ${token}` } as any : undefined;

  // First try main, then master
  let branch = 'main';
  let treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, { headers });
  
  if (!treeRes.ok) {
    if (treeRes.status === 404) {
      branch = 'master';
      treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, { headers });
    }
  }

  if (!treeRes.ok) {
    const errorData = await treeRes.json().catch(() => ({ message: treeRes.statusText }));
    throw new Error(`Could not fetch repository tree: ${errorData.message || treeRes.status}`);
  }

  const treeData = await treeRes.json();
  const tree = treeData.tree as Array<{
    path: string;
    mode: string;
    type: 'blob' | 'tree';
    sha: string;
    size?: number;
    url: string;
  }>;

  // Build folders and notes
  const folders: Folder[] = [];
  const notes: Note[] = [];

  const repoId = 'root';
  folders.push({
    id: repoId,
    name: repo,
    path: `${defaultPath}/${repo}`,
    parentId: null,
    childIds: [],
    noteIds: [],
  });

  const folderMap = new Map<string, string>(); // path -> id
  folderMap.set('', repoId);

  // Sort tree to ensure folders are processed before their contents
  const sortedTree = [...tree].sort((a, b) => a.path.localeCompare(b.path));

  for (const item of sortedTree) {
    const parts = item.path.split('/');
    const name = parts[parts.length - 1];
    const parentPath = parts.slice(0, -1).join('/');
    const parentId = folderMap.get(parentPath) || repoId;

    if (item.type === 'tree') {
      const folderId = `folder-${item.sha}`;
      folderMap.set(item.path, folderId);
      
      const newFolder: Folder = {
        id: folderId,
        name: name,
        path: `${defaultPath}/${repo}/${item.path}`,
        parentId,
        childIds: [],
        noteIds: [],
      };
      folders.push(newFolder);
      
      const p = folders.find(f => f.id === parentId);
      if (p) p.childIds.push(folderId);

    } else if (item.type === 'blob' && name.endsWith('.md')) {
      const noteId = `note-${item.sha}`;
      // Fetch contents
      const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${item.path}?ref=${branch}`, { headers });
      let content = `# ${name}\n\nFailed to load content.`;
      if (fileRes.ok) {
        const fileData = await fileRes.json();
        if (fileData.content) {
          content = decodeURIComponent(escape(atob(fileData.content)));
        }
      }

      const newNote: Note = {
        id: noteId,
        title: name.replace(/\.md$/, ''),
        content,
        path: `${defaultPath}/${repo}/${item.path}`,
        parentId,
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        sha: item.sha,
        githubPath: item.path,
        branch
      };
      notes.push(newNote);
      
      const p = folders.find(f => f.id === parentId);
      if (p) p.noteIds.push(noteId);
    }
  }

  return { folders, notes };
};
