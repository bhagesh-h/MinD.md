import { visit } from 'unist-util-visit';

export const highlightPlugin = () => {
  return (tree: any) => {
    visit(tree, 'text', (node: any, index: number, parent: any) => {
      if (!parent || ['code', 'inlineCode', 'heading', 'link'].includes(parent.type)) return;
      if (parent.type === 'element' && parent.data?.hName === 'mark') return;

      const value = node.value;
      if (typeof value !== 'string') return;
      
      const regex = /==(.*?)==/g;
      const matches: any[] = [];
      let match;
      while ((match = regex.exec(value)) !== null) {
        matches.push({ start: match.index, end: match.index + match[0].length, text: match[1] });
      }

      if (matches.length === 0) return;

      const children: any[] = [];
      let lastIndex = 0;

      matches.forEach(m => {
        if (m.start > lastIndex) {
          children.push({ type: 'text', value: value.slice(lastIndex, m.start) });
        }
        children.push({
          type: 'html',
          value: `<mark class="highlight">${m.text}</mark>`
        });
        lastIndex = m.end;
      });

      if (lastIndex < value.length) {
        children.push({ type: 'text', value: value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...children);
    });
  };
};

export const calloutPlugin = () => {
  return (tree: any) => {
    visit(tree, 'blockquote', (node: any) => {
      if (node.children && node.children.length > 0 && node.children[0].type === 'paragraph') {
        const firstChild = node.children[0];
        if (firstChild.children && firstChild.children.length > 0 && firstChild.children[0].type === 'text') {
           const textNode = firstChild.children[0];
           const textValue = textNode.value;
           
           // Match [!type] or [!type] Title
           // GitHub markdown syntax is `> [!NOTE]` with optional following text
           // Quarto types: note, tip, warning, caution, important
           const match = textValue.match(/^\[!(note|tip|warning|caution|important|info|sticky)\](?: (.*))?/i);
           if (match) {
             let type = match[1].toLowerCase();
             // Map some legacy types
             if (type === 'sticky' || type === 'info') type = 'note';

             // Check if newline exists to limit title parsing
             const newlineIndex = textValue.indexOf('\n');
             let titleMatchFragment = match[2] || '';
             let restOfLine = '';
             let restOfText = '';

             if (newlineIndex !== -1) {
               const firstLine = textValue.slice(0, newlineIndex);
               const titleMatch = firstLine.match(/^\[!\w+\](?: (.*))?/i);
               titleMatchFragment = (titleMatch && titleMatch[1]) ? titleMatch[1].trim() : '';
               restOfText = textValue.slice(newlineIndex);
             } else {
               restOfText = '';
               titleMatchFragment = titleMatchFragment.trim();
             }

             const title = titleMatchFragment || type.charAt(0).toUpperCase() + type.slice(1);
             
             textNode.value = restOfText.replace(/^\n/, '');
             
             node.data = node.data || {};
             node.data.hName = 'div';
             node.data.hProperties = { className: ['callout', `callout-${type}`] };

             const headerNode = {
               type: 'paragraph',
               data: {
                 hName: 'div',
                 hProperties: { className: ['callout-header'] }
               },
               children: [
                 {
                   type: 'paragraph',
                   data: { hName: 'div', hProperties: { className: ['callout-icon'] } },
                   children: []
                 },
                 {
                   type: 'paragraph',
                   data: { hName: 'div', hProperties: { className: ['callout-title-container'] } },
                   children: [{ type: 'text', value: title }]
                 }
               ]
             };
             
             const originalChildren = [...node.children];
             
             const bodyNode = {
               type: 'paragraph',
               data: {
                 hName: 'div',
                 hProperties: { className: ['callout-body-container'] }
               },
               children: originalChildren
             };
             
             node.children = [headerNode, bodyNode];
           }
        }
      }
    });
  };
};
