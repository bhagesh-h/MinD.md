import React, { lazy, Suspense } from 'react';
import { HelpCircle } from 'lucide-react';

const MarkdownRenderer = lazy(() => import('../core/markdown').then(m => ({ default: m.MarkdownRenderer })));

const HELP_CONTENT = `# Markdown Elements Guide

This guide shows all possible markdown elements that can be used and rendered in MinD.md.

## Typography

### Headers

# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6

### Emphasis

*Italic text* or _Italic text_
**Bold text** or __Bold text__
***Bold and Italic***
~~Strikethrough text~~
==Highlighted text==

## Lists

### Unordered List

* Item 1
* Item 2
  * Subitem 2.1
  * Subitem 2.2
    * Sub-subitem

### Ordered List

1. First item
2. Second item
3. Third item
   1. Sub-item 1
   2. Sub-item 2

### Task List

- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

## Blockquotes

> This is a blockquote.
> It can span multiple lines.
>> And can be nested.

## Code

### Inline Code

You can use \`inline code\` by wrapping text in backticks.

### Code Block

\`\`\`javascript
function calculateSum(a, b) {
  return a + b;
}
\`\`\`

## Links and Images

[Link to GitHub](https://github.com)

![Placeholder Image](https://via.placeholder.com/150)

## Tables

| Header 1 | Header 2 | Header 3 |
| :--- | :---: | ---: |
| Left aligned | Center aligned | Right aligned |
| Row 2 | Cell | Cell |
| Row 3 | Cell | Cell |

## Callouts

> [!note] Note Callout
> This is a basic note callout.

> [!tip] Tip Callout
> This is a tip callout.

> [!info] Info Callout
> This is an info callout.

> [!warning] Warning Callout
> This is a warning callout.

> [!caution] Caution Callout
> This is a caution callout.

> [!important] Important Callout
> This is an important callout.

## Diagrams and Advanced Features

### Math Expressions (LaTeX)

Inline math: $E=mc^2$ or $\\int_{a}^{b} x^2 dx$

Block math:

$$
\\frac{n!}{k!(n-k)!} = \\binom{n}{k}
$$

### Sequence Diagrams (Mermaid)

\`\`\`mermaid
sequenceDiagram
    Alice->>Bob: Hello Bob, how are you?
    alt is sick
        Bob->>Alice: Not so good :(
    else is well
        Bob->>Alice: Feeling fresh like a daisy
    end
    opt Extra response
        Bob->>Alice: Thanks for asking
    end
\`\`\`

### Flowcharts (Mermaid)

\`\`\`mermaid
graph LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
\`\`\`

### State Diagrams (Mermaid)

\`\`\`mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
\`\`\`

### Class Diagrams (Mermaid)

\`\`\`mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }
\`\`\`

### Pie Charts (Mermaid)

\`\`\`mermaid
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
\`\`\`

### Gantt Charts (Mermaid)

\`\`\`mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
\`\`\`
`;

export const Help: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white overflow-hidden">
      <header className="h-14 border-b border-[#262626] bg-[#111] flex items-center justify-between px-4 shrink-0 px-8">
        <div className="flex items-center gap-3">
          <HelpCircle size={18} className="text-[#a3a3a3]" />
          <span className="text-sm font-medium text-[#e5e5e5]">Help Guide</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 h-full border-r border-[#262626] overflow-hidden">
          <textarea
            value={HELP_CONTENT}
            readOnly
            className="w-full h-full bg-transparent p-8 outline-none resize-none text-[#a3a3a3] font-mono text-[13px] leading-relaxed custom-scrollbar"
            spellCheck={false}
          />
        </div>
        <div className="flex-1 h-full overflow-y-auto bg-[#0a0a0a] p-8 pb-32 custom-scrollbar">
          <Suspense fallback={<div className="animate-pulse flex space-x-4">Loading...</div>}>
            <MarkdownRenderer content={HELP_CONTENT} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
