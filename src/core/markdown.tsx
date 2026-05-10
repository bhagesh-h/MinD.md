import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkGemoji from 'remark-gemoji';
import remarkToc from 'remark-toc';
import remarkBreaks from 'remark-breaks';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { Mermaid } from '../components/Mermaid';

import { Note } from '../types';
import { visit } from 'unist-util-visit';
import { highlightPlugin, calloutPlugin } from './markdown-plugins';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  notes?: Note[];
  onNoteSelect?: (id: string) => void;
  currentNoteId?: string;
}

const autoLinkPlugin = (notes: Note[], currentNoteId?: string) => {
  const sortedNotes = [...notes]
    .filter(n => n.id !== currentNoteId && n.title.trim().length > 2)
    .sort((a, b) => b.title.length - a.title.length);

  // Pre-compute a single Regex for all notes instead of looping
  const escapedTitles = sortedNotes.map(n => n.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const combinedRegex = escapedTitles.length > 0 
    ? new RegExp(`\\b(${escapedTitles.join('|')})\\b`, 'gi') 
    : null;

  return (tree: any) => {
    if (!combinedRegex) return;

    visit(tree, 'text', (node: any, index: number, parent: any) => {
      if (!parent || ['link', 'code', 'inlineCode'].includes(parent.type)) return;

      let value = node.value;
      const children: any[] = [];
      let lastIndex = 0;
      const matches: { start: number; end: number; note: Note }[] = [];

      let match;
      combinedRegex.lastIndex = 0; // Reset state for global regex
      
      while ((match = combinedRegex.exec(value)) !== null) {
        const start = match.index;
        const end = match.index + match[0].length;
        const matchedText = match[0].toLowerCase();
        
        const note = sortedNotes.find(n => n.title.toLowerCase() === matchedText);
        
        if (note && !matches.some(m => (start >= m.start && start < m.end) || (end > m.start && end <= m.end))) {
          matches.push({ start, end, note });
        }
      }

      // Sort matches by start index
      matches.sort((a, b) => a.start - b.start);

      if (matches.length === 0) return;

      matches.forEach(match => {
        if (match.start > lastIndex) {
          children.push({ type: 'text', value: value.slice(lastIndex, match.start) });
        }
        children.push({
          type: 'link',
          url: `note:${match.note.id}`,
          children: [{ type: 'text', value: value.slice(match.start, match.end) }]
        });
        lastIndex = match.end;
      });

      if (lastIndex < value.length) {
        children.push({ type: 'text', value: value.slice(lastIndex) });
      }

      // Replace the current text node with the new fragments
      parent.children.splice(index, 1, ...children);
    });
  };
};

export const MarkdownRenderer = React.memo<MarkdownRendererProps>(({ content, className, notes = [], onNoteSelect, currentNoteId }) => {
  const remarkPlugins = React.useMemo(() => [
    remarkGfm, 
    remarkMath, 
    remarkGemoji, 
    [remarkToc, { heading: 'toc|table of contents' }], 
    remarkBreaks, 
    remarkFrontmatter,
    [autoLinkPlugin, notes, currentNoteId],
    highlightPlugin,
    calloutPlugin
  ], [notes, currentNoteId]);

  const rehypePlugins = React.useMemo(() => [
    rehypeRaw,
    [rehypeSanitize, {
      ...defaultSchema,
      tagNames: [...(defaultSchema.tagNames || []), 'mark', 'div', 'span'],
      attributes: {
        ...defaultSchema.attributes,
        code: [...(defaultSchema.attributes?.code || []), 'className'],
        mark: ['className'],
        div: ['className'],
        span: ['className']
      },
    }],
    rehypeKatex
  ], []);

  const components = React.useMemo(() => ({
    a({ node, children, href, ...props }: any) {
      if (href?.startsWith('note:')) {
        const noteId = href.split(':')[1];
        return (
          <button 
            onClick={(e) => { e.preventDefault(); onNoteSelect?.(noteId); }}
            className="text-app-primary hover:underline font-bold cursor-pointer transition-all decoration-app-primary/30 underline-offset-4"
            title="Internal Note Link"
          >
            {children}
          </button>
        );
      }
      return <a href={href} {...props} target="_blank" rel="noopener noreferrer">{children}</a>;
    },
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      
      if (!inline && match && match[1] === 'mermaid') {
        return <Mermaid chart={String(children)} />;
      }

      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  }), [onNoteSelect]);

  return (
    <div className={`markdown-body prose prose-invert prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-300 prose-strong:text-white max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins as any}
        rehypePlugins={rehypePlugins as any}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
