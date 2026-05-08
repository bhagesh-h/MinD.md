import React, { useState, lazy, Suspense, useRef, useEffect } from 'react';
import { Eye, Edit3, Columns, Hash, Copy, Download, Trash2, ChevronLeft, ChevronRight, FileDown, FileText, ChevronDown, RefreshCw } from 'lucide-react';
import { Note } from '../types';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { cn } from '../lib/utils';
import { getTagColor, useAppearance } from '../lib/appearance';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

const MarkdownRenderer = lazy(() => import('../core/markdown').then(m => ({ default: m.MarkdownRenderer })));

interface EditorProps {
  note: Note | undefined;
  notes: Note[];
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onSelectNote: (id: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ note, notes, onUpdate, onSelectNote }) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'md' | 'txt' | 'html' | 'pdf' | 'doc'>('md');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const [cursorInfo, setCursorInfo] = useState({ line: 1, col: 1, selChars: 0, selWords: 0 });
  const appearance = useAppearance(); // Trigger re-render on appearance update

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateCursorInfo = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const { selectionStart, selectionEnd, selectionDirection, value } = target;
    
    // The cursor is at selectionEnd unless the user selected text backwards
    const cursorPos = selectionDirection === 'backward' ? selectionStart : selectionEnd;
    
    const textBeforeCursor = value.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;

    let selChars = 0;
    let selWords = 0;

    if (selectionStart !== selectionEnd) {
      const selectedText = value.substring(selectionStart, selectionEnd);
      selChars = selectedText.length;
      selWords = selectedText.split(/\s+/).filter(Boolean).length;
    }

    setCursorInfo({ line, col, selChars, selWords });
  };

  React.useEffect(() => {
    const handleExportEvent = () => {
      handleExport();
    };
    window.addEventListener('export-active-note', handleExportEvent);
    return () => window.removeEventListener('export-active-note', handleExportEvent);
  }, [note, selectedFormat]); // Dependencies needed inside handleExport

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] text-[#a3a3a3]">
        <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-4 bg-[#111] rounded-full">
                <FileText size={48} className="opacity-20" />
            </div>
            <p className="text-sm">Select a note to start editing or create a new one.</p>
        </div>
      </div>
    );
  }

  const getRenderedHtml = async () => {
    const { unified } = await import('unified');
    const { default: remarkParse } = await import('remark-parse');
    const { default: remarkGfm } = await import('remark-gfm');
    const { default: remarkMath } = await import('remark-math');
    const { default: remarkBreaks } = await import('remark-breaks');
    const { default: remarkRehype } = await import('remark-rehype');
    const { default: rehypeStringify } = await import('rehype-stringify');
    const { default: rehypeRaw } = await import('rehype-raw');

    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkBreaks)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
      .process(note.content);

    return String(file);
  };

  const getProcessedPreviewHtml = async (): Promise<HTMLElement> => {
    let currentViewMode = viewMode;
    if (viewMode === 'edit') {
      setViewMode('split');
    }

    let previewContainer = document.querySelector('.prose');
    let attempts = 0;
    while (!previewContainer && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      previewContainer = document.querySelector('.prose');
      attempts++;
    }

    if (!previewContainer) {
      if (currentViewMode === 'edit') setViewMode('edit');
      throw new Error("Preview container not found!");
    }

    const clone = previewContainer.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    document.body.appendChild(clone);
    
    // Clean up mermaid charts for exports (remove zoom controls, make full height)
    const mermaidOuters = clone.querySelectorAll('.mermaid-outer-wrapper');
    mermaidOuters.forEach(container => {
      const mermaidInner = container.querySelector('.mermaid-wrapper');
      if (mermaidInner) {
        container.innerHTML = '';
        container.appendChild(mermaidInner);
        container.classList.remove('overflow-hidden');
        (container as HTMLElement).style.overflow = 'visible';
        (container as HTMLElement).style.height = 'auto';
        (container as HTMLElement).style.display = 'flex';
        (container as HTMLElement).style.justifyContent = 'center';
        (container as HTMLElement).style.width = '100%';
        (mermaidInner as HTMLElement).style.width = '100%';
        (mermaidInner as HTMLElement).style.height = 'auto';
        (mermaidInner as HTMLElement).style.overflow = 'visible';
        (mermaidInner as HTMLElement).style.display = 'flex';
        (mermaidInner as HTMLElement).style.justifyContent = 'center';
      }
    });

    const svgs = Array.from(clone.querySelectorAll('svg'));
    for (const svg of svgs) {
      // Don't convert simple UI icons if we can help it, but convert everything for docs
      if (!svg.getAttribute('xmlns')) {
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      }
      
      // Ensure specific elements have necessary namespaces if needed
      // but standard XMLSerializer usually handles it
      const svgData = new XMLSerializer().serializeToString(svg);
      const encodedData = window.btoa(unescape(encodeURIComponent(svgData)));
      
      const img = document.createElement('img');
      img.style.cssText = svg.style.cssText;
      img.className = svg.className;
      
      // Try to maintain dimensions but let them be responsive
      const rect = svg.getBoundingClientRect();
      const width = svg.getAttribute('width') || String(rect.width);
      const height = svg.getAttribute('height') || String(rect.height);
      
      const pxWidth = rect.width > 0 ? rect.width : parseFloat(width) || 800;
      const pxHeight = rect.height > 0 ? rect.height : parseFloat(height) || 600;
      
      if (width) img.style.width = typeof width === 'number' ? `${width}px` : `${width}`.includes('%') ? width : `${parseFloat(`${width}`)}px`;
      else img.style.width = '100%';
      
      if (height) img.style.height = typeof height === 'number' ? `${height}px` : `${height}`.includes('%') ? height : `${parseFloat(`${height}`)}px`;
      else img.style.height = 'auto';
      
      img.style.display = 'block';
      img.style.margin = '0 auto';
      
      await new Promise<void>((resolve) => {
        const tempImg = new Image();
        tempImg.onload = () => {
          const canvas = document.createElement('canvas');
          let renderWidth = tempImg.width || pxWidth;
          let renderHeight = tempImg.height || pxHeight;
          
          canvas.width = renderWidth * 2; // Double resolution for Retina/Print
          canvas.height = renderHeight * 2;
          const ctx = canvas.getContext('2d');
          if (ctx) {
             ctx.fillStyle = "white";
             ctx.fillRect(0, 0, canvas.width, canvas.height);
             ctx.scale(2, 2);
             ctx.drawImage(tempImg, 0, 0, renderWidth, renderHeight);
             img.src = canvas.toDataURL('image/png');
          } else {
             img.src = `data:image/svg+xml;base64,${encodedData}`;
          }
          resolve();
        };
        tempImg.onerror = () => {
          img.src = `data:image/svg+xml;base64,${encodedData}`;
          resolve();
        };
        tempImg.src = `data:image/svg+xml;base64,${encodedData}`;
      });
      
      svg.replaceWith(img);
    }

    document.body.removeChild(clone);

    if (currentViewMode === 'edit') {
      setViewMode('edit');
    }

    return clone;
  };

  const handleExport = async () => {
    if (!note) return;
    setIsExporting(true);
    try {
      const filename = `${note.title.replace(/\s+/g, '-').toLowerCase()}`;
      
      switch (selectedFormat) {
        case 'md': {
          const blob = new Blob([note.content], { type: 'text/markdown;charset=utf-8' });
          saveAs(blob, `${filename}.md`);
          break;
        }
        case 'txt': {
          const blob = new Blob([note.content], { type: 'text/plain;charset=utf-8' });
          saveAs(blob, `${filename}.txt`);
          break;
        }
        case 'html': {
          const clone = await getProcessedPreviewHtml();
          const contentHtml = clone.innerHTML;
          const calloutStyles = appearance?.callouts ? Object.entries(appearance.callouts).map(([type, props]: [string, any]) => `
            .callout-${type} { border-left-color: ${props.border}; background-color: ${props.background}; color: ${props.text}; }
            .callout-${type} .callout-title-container { color: ${props.border}; }
            .callout-${type} .callout-icon { background-color: ${props.border}; }
          `).join('') : `
            .callout-note, .callout-info { border-left-color: #447099; background-color: #f0f7fb; color: #000; }
            .callout-note .callout-title-container, .callout-info .callout-title-container { color: #447099; }
            .callout-note .callout-icon, .callout-info .callout-icon { background-color: #447099; }
            .callout-tip { border-left-color: #027a38; background-color: #eefaef; color: #000; }
            .callout-tip .callout-title-container { color: #027a38; }
            .callout-tip .callout-icon { background-color: #027a38; }
            .callout-warning { border-left-color: #d9971c; background-color: #fff9ed; color: #000; }
            .callout-warning .callout-title-container { color: #d9971c; }
            .callout-warning .callout-icon { background-color: #d9971c; }
            .callout-caution { border-left-color: #cc5500; background-color: #fff5f0; color: #000; }
            .callout-caution .callout-title-container { color: #cc5500; }
            .callout-caution .callout-icon { background-color: #cc5500; }
            .callout-important { border-left-color: #cc0000; background-color: #fcecec; color: #000; }
            .callout-important .callout-title-container { color: #cc0000; }
            .callout-important .callout-icon { background-color: #cc0000; }
          `;
          
          const docHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>${note.title}</title>
              <style>
                body { font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; color: #1a1a1a; }
                h1 { color: #000; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                img, svg { max-width: 100%; border-radius: 8px; display: block; margin: 0 auto; }
                pre { background: #f6f8fa; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; white-space: pre-wrap; }
                code { background: #f6f8fa; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; }
                blockquote { border-left: 4px solid #dfe2e5; padding-left: 16px; color: #6a737d; margin: 0; }
                table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                th, td { border: 1px solid #dfe2e5; padding: 8px 12px; }
                th { background: #f6f8fa; }
                .metadata { color: #666; font-size: 0.9em; margin-bottom: 20px; }
                .mermaid-outer-wrapper { display: flex; justify-content: center; width: 100%; margin: 20px 0; }
                .mermaid-wrapper { display: flex; justify-content: center; width: 100%; }
                mark.highlight { background-color: #fce788; padding: 0 4px; border-radius: 4px; }
                .callout { padding: 16px; margin: 20px 0; border-radius: 4px; border-left: 4px solid #ddd; background: #f9f9f9; display: block; overflow: hidden; }
                .callout-header { display: flex; align-items: center; gap: 8px; padding-bottom: 8px; font-weight: bold; border-bottom: 1px solid rgba(0,0,0,0.05); margin-bottom: 8px; }
                .callout-icon { width: 16px; height: 16px; mask-size: contain; mask-repeat: no-repeat; mask-position: center; -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center; }
                .callout-note .callout-icon, .callout-info .callout-icon, .callout-tip .callout-icon, .callout-warning .callout-icon, .callout-caution .callout-icon, .callout-important .callout-icon { -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='12' y1='16' x2='12' y2='12'/%3E%3Cline x1='12' y1='8' x2='12.01' y2='8'/%3E%3C/svg%3E"); }
                ${calloutStyles}
              </style>
            </head>
            <body>
              <h1>${note.title}</h1>
              <div class="metadata">
                <p>Created: ${new Date(note.createdAt).toLocaleDateString()} | Tags: ${note.tags.join(', ')}</p>
              </div>
              <div class="content">${contentHtml}</div>
            </body>
            </html>
          `;
          const blob = new Blob([docHtml], { type: 'text/html;charset=utf-8' });
          saveAs(blob, `${filename}.html`);
          break;
        }
        case 'pdf': {
          const { default: html2pdf } = await import('html2pdf.js');
          const clone = await getProcessedPreviewHtml();
          
          // Strip tailwind color classes that might compute to oklab/oklch
          const contentHtml = clone.innerHTML.replace(/\s+class="([^"]*)"/g, (match, classNames) => {
            const keep = classNames.split(' ').filter((c: string) => 
              c.includes('callout') || 
              c.includes('mermaid') || 
              c.includes('highlight') || 
              c.includes('task-list') || 
              c.startsWith('language-')
            ).join(' ');
            return keep ? ` class="${keep}"` : '';
          });

          const calloutStyles = appearance?.callouts ? Object.entries(appearance.callouts).map(([type, props]: [string, any]) => `
            #pdf-export-container .callout-${type} { border-left-color: ${props.border} !important; background-color: ${props.background} !important; color: ${props.text} !important; }
            #pdf-export-container .callout-${type} .callout-title-container { color: ${props.border} !important; }
            #pdf-export-container .callout-${type} .callout-icon { background-color: ${props.border} !important; }
          `).join('') : `
            #pdf-export-container .callout-note, #pdf-export-container .callout-info { border-left-color: #447099 !important; background-color: #f0f7fb !important; color: #000 !important; }
            #pdf-export-container .callout-note .callout-title-container, #pdf-export-container .callout-info .callout-title-container { color: #447099 !important; }
            #pdf-export-container .callout-note .callout-icon, #pdf-export-container .callout-info .callout-icon { background-color: #447099 !important; }
            #pdf-export-container .callout-tip { border-left-color: #027a38 !important; background-color: #eefaef !important; color: #000 !important; }
            #pdf-export-container .callout-tip .callout-title-container { color: #027a38 !important; }
            #pdf-export-container .callout-tip .callout-icon { background-color: #027a38 !important; }
            #pdf-export-container .callout-warning { border-left-color: #d9971c !important; background-color: #fff9ed !important; color: #000 !important; }
            #pdf-export-container .callout-warning .callout-title-container { color: #d9971c !important; }
            #pdf-export-container .callout-warning .callout-icon { background-color: #d9971c !important; }
            #pdf-export-container .callout-caution { border-left-color: #cc5500 !important; background-color: #fff5f0 !important; color: #000 !important; }
            #pdf-export-container .callout-caution .callout-title-container { color: #cc5500 !important; }
            #pdf-export-container .callout-caution .callout-icon { background-color: #cc5500 !important; }
            #pdf-export-container .callout-important { border-left-color: #cc0000 !important; background-color: #fcecec !important; color: #000 !important; }
            #pdf-export-container .callout-important .callout-title-container { color: #cc0000 !important; }
            #pdf-export-container .callout-important .callout-icon { background-color: #cc0000 !important; }
          `;
          
          const docHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>${note.title}</title>
              <style>
                #pdf-export-container, 
                #pdf-export-container *, 
                #pdf-export-container *::before, 
                #pdf-export-container *::after {
                  border-color: #e5e5e5;
                  outline-color: transparent;
                  text-decoration-color: transparent;
                  box-shadow: none;
                }
                #pdf-export-container { font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; color: #1a1a1a; background: #ffffff; }
                #pdf-export-container h1 { color: #000; border-bottom: 2px solid #eee !important; padding-bottom: 10px; }
                #pdf-export-container img, #pdf-export-container svg { max-width: 100%; border-radius: 8px; display: block; margin: 0 auto; }
                #pdf-export-container pre { background: #f6f8fa; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; white-space: pre-wrap; }
                #pdf-export-container code { background: #f6f8fa; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; color: #1e1e1e; font-size: 0.875em;}
                #pdf-export-container blockquote { border-left: 4px solid #dfe2e5 !important; padding-left: 16px; color: #6a737d; margin: 0; }
                #pdf-export-container table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                #pdf-export-container th, #pdf-export-container td { border: 1px solid #dfe2e5 !important; padding: 8px 12px; }
                #pdf-export-container th { background: #f6f8fa; }
                #pdf-export-container .metadata { color: #666; font-size: 0.9em; margin-bottom: 20px; text-align: left; }
                #pdf-export-container .mermaid-outer-wrapper { display: flex; justify-content: center; width: 100%; margin: 20px 0; }
                #pdf-export-container .mermaid-wrapper { display: flex; justify-content: center; width: 100%; }
                #pdf-export-container mark.highlight { background-color: #fce788 !important; padding: 0 4px; border-radius: 4px; }
                #pdf-export-container .callout { padding: 16px; margin: 20px 0; border-radius: 4px; border-left: 4px solid #ddd !important; background: #f9f9f9; display: block; overflow: hidden; }
                #pdf-export-container .callout-header { display: flex; align-items: center; gap: 8px; padding-bottom: 8px; font-weight: bold; border-bottom: 1px solid rgba(0,0,0,0.05) !important; margin-bottom: 8px; }
                #pdf-export-container .callout-icon { width: 16px; height: 16px; mask-size: contain; mask-repeat: no-repeat; mask-position: center; -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center; }
                #pdf-export-container .callout-note .callout-icon, #pdf-export-container .callout-info .callout-icon, #pdf-export-container .callout-tip .callout-icon, #pdf-export-container .callout-warning .callout-icon, #pdf-export-container .callout-caution .callout-icon, #pdf-export-container .callout-important .callout-icon { -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='12' y1='16' x2='12' y2='12'/%3E%3Cline x1='12' y1='8' x2='12.01' y2='8'/%3E%3C/svg%3E"); }
                ${calloutStyles}
              </style>
            </head>
            <body>
              <div id="pdf-export-container">
                <h1>${note.title}</h1>
                <div class="metadata">
                  <p>Created: ${new Date(note.createdAt).toLocaleDateString()} | Tags: ${note.tags.join(', ')}</p>
                </div>
                <div class="content">${contentHtml}</div>
              </div>
            </body>
            </html>
          `;

          const container = document.createElement('div');
          container.id = 'pdf-export-wrapper';
          container.style.position = 'absolute';
          container.style.left = '-9999px';
          container.style.width = '800px';
          container.style.color = '#1a1a1a';
          container.style.backgroundColor = '#ffffff';
          container.innerHTML = docHtml;
          document.body.appendChild(container); 

          const opt = {
            margin:       10,
            filename:     `${filename}.pdf`,
            image:        { type: 'jpeg' as const, quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
          };

          const element = (container.querySelector('#pdf-export-container') as HTMLElement) || container;
          await html2pdf().set(opt).from(element).save();
          
          document.body.removeChild(container);
          break;
        }
        case 'doc': {
          const clone = await getProcessedPreviewHtml();
          const contentHtml = clone.innerHTML;
          const calloutStyles = appearance?.callouts ? Object.entries(appearance.callouts).map(([type, props]: [string, any]) => `
            .callout-${type} { border-left-color: ${props.border}; background-color: ${props.background}; color: ${props.text}; }
            .callout-${type} .callout-title-container { color: ${props.border}; }
            .callout-${type} .callout-icon { background-color: ${props.border}; }
          `).join('') : `
            .callout-note, .callout-info { border-left-color: #447099; background-color: #f0f7fb; color: #000; }
            .callout-note .callout-title-container, .callout-info .callout-title-container { color: #447099; }
            .callout-note .callout-icon, .callout-info .callout-icon { background-color: #447099; }
            .callout-tip { border-left-color: #027a38; background-color: #eefaef; color: #000; }
            .callout-tip .callout-title-container { color: #027a38; }
            .callout-tip .callout-icon { background-color: #027a38; }
            .callout-warning { border-left-color: #d9971c; background-color: #fff9ed; color: #000; }
            .callout-warning .callout-title-container { color: #d9971c; }
            .callout-warning .callout-icon { background-color: #d9971c; }
            .callout-caution { border-left-color: #cc5500; background-color: #fff5f0; color: #000; }
            .callout-caution .callout-title-container { color: #cc5500; }
            .callout-caution .callout-icon { background-color: #cc5500; }
            .callout-important { border-left-color: #cc0000; background-color: #fcecec; color: #000; }
            .callout-important .callout-title-container { color: #cc0000; }
            .callout-important .callout-icon { background-color: #cc0000; }
          `;

          const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
                "xmlns:w='urn:schemas-microsoft-com:office:word' "+
                "xmlns='http://www.w3.org/TR/REC-html40'>"+
                `<head><meta charset='utf-8'><title>${note.title}</title><style>
                  body { font-family: sans-serif; } 
                  img, svg { display: block; margin: 0 auto; max-width: 100%; }
                  .mermaid-outer-wrapper { text-align: center; width: 100%; } 
                  .mermaid-wrapper { text-align: center; width: 100%; }
                  mark.highlight { background-color: #fce788; padding: 0 4px; border-radius: 4px; }
                  .callout { padding: 16px; margin: 20px 0; border-radius: 4px; border-left: 4px solid #ddd; background: #f9f9f9; display: block; overflow: hidden; }
                  .callout-header { display: flex; align-items: center; gap: 8px; padding-bottom: 8px; font-weight: bold; border-bottom: 1px solid rgba(0,0,0,0.05); margin-bottom: 8px; }
                  .callout-icon { width: 16px; height: 16px; mask-size: contain; mask-repeat: no-repeat; mask-position: center; -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center; }
                  .callout-note .callout-icon, .callout-info .callout-icon, .callout-tip .callout-icon, .callout-warning .callout-icon, .callout-caution .callout-icon, .callout-important .callout-icon { -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='12' y1='16' x2='12' y2='12'/%3E%3Cline x1='12' y1='8' x2='12.01' y2='8'/%3E%3C/svg%3E"); }
                  ${calloutStyles}
                </style></head><body>`;
          const footer = "</body></html>";
          const sourceHTML = header + `<h1 style="text-align: center;">${note.title}</h1><div style="color: #666; margin-bottom: 20px; text-align: center;">Created: ${new Date(note.createdAt).toLocaleDateString()} | Tags: ${note.tags.join(', ')}</div><hr/>` + contentHtml + footer;
          
          const blob = new Blob(['\ufeff', sourceHTML], {
            type: 'application/msword'
          });
          saveAs(blob, `${filename}.doc`);
          break;
        }
      }
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden relative">
      <header className="px-4 h-14 border-b border-[#262626] flex items-center justify-between shrink-0 bg-[#111]">
        <div className="flex items-center gap-3">
          <Hash size={14} className="text-[#a3a3a3]" />
          <span className="text-xs text-white/40 uppercase tracking-widest">
            /{note.title.replace(/\s+/g, '-').toUpperCase()}.MD
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1 border border-[#262626] h-8">
            <button 
              onClick={() => setViewMode('edit')}
              className={cn("px-2 h-full rounded-md flex items-center justify-center", viewMode === 'edit' ? "bg-[#2a2a2a] text-white" : "text-[#a3a3a3] hover:text-white")}
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={() => setViewMode('split')}
              className={cn("px-2 h-full rounded-md flex items-center justify-center", viewMode === 'split' ? "bg-[#2a2a2a] text-white" : "text-[#a3a3a3] hover:text-white")}
            >
              <Columns size={16} />
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={cn("px-2 h-full rounded-md flex items-center justify-center", viewMode === 'preview' ? "bg-[#2a2a2a] text-white" : "text-[#a3a3a3] hover:text-white")}
            >
              <Eye size={16} />
            </button>
          </div>

          <div className="w-px h-6 bg-[#262626] mx-2" />

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                const { parseGithubUrl, pushGithubFile } = await import('../lib/github');
                if (!note) return;
                setIsExporting(true); // Re-use loading state or add new one
                try {
                  const repoUrl = localStorage.getItem('syncRepository');
                  if (!repoUrl) throw new Error('Repository URL not set');
                  const repoParams = parseGithubUrl(repoUrl);
                  if (!repoParams) throw new Error('Invalid repository URL');
                  
                  const branch = note.branch || 'main';
                  const path = note.githubPath || note.path.substring(1); 
                  const sha = await pushGithubFile(repoParams.owner, repoParams.repo, path, note.content, branch, note.sha);
                  onUpdate(note.id, { sha });
                  toast.success('Committed successfully to GitHub');
                } catch (e: any) {
                  toast.error(`Commit error: ${e.message}`);
                } finally {
                  setIsExporting(false);
                }
              }}
              className="bg-[#1a1a1a] hover:bg-white/10 text-[#a3a3a3] hover:text-white px-3 h-8 rounded-lg border border-[#262626] text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
              title="Commit & Push to Github"
            >
              <RefreshCw size={12} className={isExporting ? "animate-spin" : ""} />
              Commit & Sync
            </button>

            <div className="relative flex items-center bg-[#1a1a1a] rounded-lg border border-[#262626] shadow-sm h-8" ref={exportDropdownRef}>
              <div className="flex items-center h-full">
                <button
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  className="bg-transparent flex items-center gap-1 text-[10px] text-[#a3a3a3] hover:text-white px-3 h-full font-bold uppercase tracking-widest outline-none cursor-pointer border-r border-[#262626] min-w-[90px] justify-center transition-colors rounded-l-lg hover:bg-white/5"
                >
                  .{selectedFormat === 'md' ? 'markdown' : selectedFormat}
                  <ChevronDown size={12} className={cn("transition-transform", isExportMenuOpen && "rotate-180")} />
                </button>
                {isExportMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-32 bg-[#1a1a1a] border border-[#262626] rounded-lg shadow-xl overflow-hidden z-50 py-1">
                    {(['md', 'txt', 'html', 'pdf', 'doc'] as const).map(format => (
                      <button
                        key={format}
                        onClick={() => {
                          setSelectedFormat(format);
                          setIsExportMenuOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                          selectedFormat === format 
                            ? "bg-white/10 text-white" 
                            : "text-[#a3a3a3] hover:bg-white/5 hover:text-white"
                        )}
                      >
                        .{format === 'md' ? 'markdown' : format}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className={cn(
                  "px-3 h-full flex items-center justify-center transition-all active:scale-95 group rounded-r-lg",
                  isExporting ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5 text-white/50 hover:text-white"
                )}
                title={`Export as ${selectedFormat.toUpperCase()}`}
              >
                {isExporting ? (
                  <div className="w-3.5 h-3.5 border border-white/20 border-t-white/80 rounded-full animate-spin" />
                ) : (
                  <Download size={14} className="group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Metadata Header */}
      <div className="px-8 pt-8 pb-4 bg-[#0a0a0a] border-b border-white/[0.03]">
        <input 
          type="text" 
          value={note.title}
          onChange={(e) => onUpdate(note.id, { title: e.target.value })}
          className="bg-transparent border-none outline-none text-4xl font-bold text-white focus:ring-0 p-0 w-full mb-4 placeholder:text-white/20"
          placeholder="Untitled Note"
        />
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest">
            <span>Created:</span>
            <span className="text-white/60">{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-2 flex-1">
            <span className="text-white/40 uppercase tracking-widest shrink-0">Tags:</span>
            <div className="flex flex-wrap gap-1.5 flex-1">
              {note.tags.map(tag => {
                const color = getTagColor(tag);
                return (
                  <span 
                    key={tag} 
                    className="px-2 py-0.5 rounded-md flex items-center gap-1 group/tag text-[13px] font-medium tracking-tight"
                    style={{ 
                      backgroundColor: `${color}15`, 
                      color: color,
                      borderColor: `${color}30`,
                      borderWidth: '1px'
                    }}
                  >
                    #{tag}
                    <button 
                      onClick={() => onUpdate(note.id, { tags: note.tags.filter(t => t !== tag) })}
                      className="opacity-0 group-hover/tag:opacity-100 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              <input 
                type="text"
                placeholder="Add tag..."
                className="bg-transparent border-none outline-none text-white/40 focus:text-white focus:ring-0 p-0 w-24 text-[11px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const tag = e.currentTarget.value.trim();
                    if (tag && !note.tags.includes(tag)) {
                      onUpdate(note.id, { tags: [...note.tags, tag] });
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <PanelGroup orientation="horizontal" className="flex-1 overflow-hidden">
        {(viewMode === 'edit' || viewMode === 'split') && (
          <Panel defaultSize={viewMode === 'split' ? 50 : 100} minSize={20} className={cn("h-full", viewMode === 'split' && "")}>
            <textarea
              value={note.content}
              onChange={(e) => {
                onUpdate(note.id, { content: e.target.value });
                updateCursorInfo(e);
              }}
              onSelect={updateCursorInfo}
              onKeyUp={updateCursorInfo}
              onClick={updateCursorInfo}
              className="w-full h-full bg-transparent p-8 outline-none resize-none text-[#e5e5e5] font-mono text-sm leading-relaxed"
              spellCheck={false}
              placeholder="Start writing..."
            />
          </Panel>
        )}

        {viewMode === 'split' && (
          <PanelResizeHandle className="w-1 hover:w-1.5 bg-[#1a1a1a] hover:bg-[#262626] active:bg-[#333] transition-all cursor-col-resize shrink-0 flex items-center justify-center relative z-10 border-x border-[#262626]/50" />
        )}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <Panel defaultSize={viewMode === 'split' ? 50 : 100} minSize={20} className="h-full overflow-y-auto bg-[#0a0a0a] p-8 pb-32">
             <Suspense fallback={<LoadingView />}>
                <MarkdownRenderer 
                  className="print-only-prose"
                  content={note.content} 
                  notes={notes}
                  onNoteSelect={onSelectNote}
                  currentNoteId={note.id}
                />
             </Suspense>
          </Panel>
        )}
      </PanelGroup>

        <footer className="h-10 border-t border-[#262626] bg-[#111] flex items-center justify-between px-4 shrink-0 overflow-hidden">
         <div className="flex items-center gap-4 text-[10px] text-[#a3a3a3] uppercase tracking-widest">
            {cursorInfo.selChars > 0 ? (
              <>
                <span>Sel Words: {cursorInfo.selWords}</span>
                <span>Sel Chars: {cursorInfo.selChars}</span>
              </>
            ) : (
              <>
                <span>Words: {note.content.split(/\s+/).filter(Boolean).length}</span>
                <span>Chars: {note.content.length}</span>
              </>
            )}
            <div className="w-px h-3 bg-[#262626] mx-1" />
            <span>Ln {cursorInfo.line}, Col {cursorInfo.col}</span>
         </div>
         <div className="text-[10px] text-[#a3a3a3] uppercase tracking-widest lowercase">
            Last saved: {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </div>
      </footer>
    </main>
  );
};

const LoadingView = () => (
  <div className="flex items-center justify-center p-12">
    <div className="w-6 h-6 border-2 border-white/5 border-t-white/20 rounded-full animate-spin" />
  </div>
);
